// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('admin').where({
    _id: '21ded5cb5ffa8c05046f9c3a1fe25c28'
  })
  .field({
    _id: false,
    controlChat: true,
  })
  .get()

}