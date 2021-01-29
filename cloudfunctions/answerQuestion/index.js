// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    db.collection('users').where({
      openid: event.userOpenid
    })
    .update({
      data: {
        answer: true
      }
    })

    return await db.collection('questions').where({
      _id: event.id
    })
    .update({
      data: {
        'answerInfo.openid': event.openid,
        'answerInfo.answer': event.answer,
        'answerInfo.updatedTime': event.updatedTime,
        answer: true
      }
    })
  } 
  catch(e) {
    console.error(e)
  }

}