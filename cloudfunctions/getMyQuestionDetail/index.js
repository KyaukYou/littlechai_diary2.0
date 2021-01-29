// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('questions').where({
    _id: event.id
  })
  .get()

  if(res.data[0].answer === false) {
    return res;
  }
  else {
    let user = await db.collection('users').where({
      openid: res.data[0].answerInfo.openid
    }).field({
      'userInfo.nickName': true,
      'userInfo.avatarUrl': true
    }).get();
    res.data[0].answerInfo.userInfo = user.data[0].userInfo
    return res;
  }

}