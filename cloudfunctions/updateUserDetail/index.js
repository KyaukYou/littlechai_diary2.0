// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    // return event
    return await db.collection('users').where({
      openid: event.openid
    })
    .update({
      data: {
        userDetail: event.userDetail
      }
    })
  } catch(e) {
    console.error(e)
  }
}