// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return  await db.collection('users').where({
    openid: event.openid
  })
  .field({
    userDetail:true
  })
  .get()
  
}