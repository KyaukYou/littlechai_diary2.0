// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {


  let res = await db.collection('comments').where({
    diary_id: event.diary_id
  })
  .field({
    arr: true
  })
  .get()

  if(res.data.length <=0 ) {
    return [];
  }

  let arr = JSON.parse(JSON.stringify(res.data[0].arr))

  for(let i=0; i<arr.length; i++) {
    let user = await db.collection('users').where({
      openid: arr[i].openid
    }).field({
      'userInfo.nickName': true,
      'userInfo.avatarUrl': true,
      openid: true
    }).get();
    arr[i].userInfo = user.data[0].userInfo
    arr[i].userInfo.openid = user.data[0].openid

    for(let j=0; j<arr[i].arr.length; j++) {
      let user = await db.collection('users').where({
        openid: arr[i].arr[j].openid
      }).field({
        'userInfo.nickName': true,
        'userInfo.avatarUrl': true,
        openid: true
      }).get();

      let commentUser = await db.collection('users').where({
        openid: arr[i].arr[j].comment_openid
      }).field({
        'userInfo.nickName': true,
        'userInfo.avatarUrl': true,
        openid: true
      }).get();

      arr[i].arr[j].userInfo = user.data[0].userInfo
      arr[i].arr[j].userInfo.openid = user.data[0].openid

      arr[i].arr[j].comment = commentUser.data[0].userInfo
      arr[i].arr[j].comment.openid = commentUser.data[0].openid

    }  
    
  }

  return arr;

}