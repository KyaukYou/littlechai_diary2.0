// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('diarys').where({
        _id: event.id
      })
      .update({
        data: {
          lock: event.lock
        }
      })

  } catch (e) {
    console.error(e)
  }
}