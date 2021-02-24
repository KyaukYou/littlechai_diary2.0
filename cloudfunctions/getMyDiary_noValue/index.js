// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  // 第几页
  let page = Math.max(event.page * 1,1) - 1;

  // 每页几项
  let perPage = Math.max(event.per_page * 1,1);

  //排序方式
  let sortName = '';
  let sortValue = 'desc'
  if(event.sort === 'updatedTimeA') {
    sortName = 'updatedTime';
  }
  else if(event.sort === 'updatedTimeB') {
    sortName = 'updatedTime';
    sortValue = 'asc'
  }
  else if(event.sort === 'like') {
    sortName = 'like';
  }
  else if(event.sort === 'see') {
    sortName = 'see';
  }


  let res = await db.collection('diarys').where(
    {
      openid: event.openid
    }
  )
  .orderBy(sortName,sortValue)
  .field({
    updatedTime: true,
    title: true,
    title_image: true,
    see: true,
    location: true,
    lock: true,
    like: true,
    dayNum: true,
    collection: true,
    openid: true
  })
  .limit(perPage)
  .skip(page * perPage)
  .get()

  for(let i=0; i<res.data.length; i++) {
    let user = await db.collection('users').where({
      openid: res.data[i].openid
    }).field({
      'userInfo.nickName': true,
      'userInfo.avatarUrl': true,
      openid: true
    }).get();
    if(user.data.length > 0) {
      res.data[i].userInfo = user.data[0].userInfo
      res.data[i].userInfo.openid = user.data[0].openid
    }
    
  }

  return res;

}