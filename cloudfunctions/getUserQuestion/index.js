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
  const page = Math.max(event.page * 1,1) - 1;

  // 每页几项
  const perPage = Math.max(event.per_page * 1,1);

  let res = await db.collection('questions')
  .orderBy('updatedTime','desc')
  .field({
    question: true,
    updatedTime: true,
    answer: true,
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
      'userInfo.avatarUrl': true
    }).get();
    res.data[i].userInfo = user.data[0].userInfo
  }

  return res;

}