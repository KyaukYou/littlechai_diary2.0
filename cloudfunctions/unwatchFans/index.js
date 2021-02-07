// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    let fArr = await db.collection('users').where({
      openid: event.openid
    })
    .field({
      following: true
    }).get();

    // let arr = JSON.parse(JSON.stringify(fArr.data[0].following));
    // let arrIndex = null;
    // for(let i=0; i<arr; i++) {
    //   if(arr[i] === event.userOpenid) {
    //     arrIndex = i;
    //   }
    // }

    await db.collection('users').where({
      openid: event.openid
    })
    .update({
      data: {
        following: _.pull(event.userOpenid),
        following_num: _.inc(-1)
      }
    })

    let res = await db.collection('users').where({
      openid: event.userOpenid
    })
    .update({
      data: {
        fans: _.inc(-1)
      }
    })
    return res

  } 
  catch(e) {
    console.error(e)
  }

}