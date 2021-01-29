// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    return await db.collection('questions').add({
      data: {
        answer: false,
        answerInfo: {},
        question: event.question,
        openid: event.openid,
        updatedTime: event.updatedTime,
        ifDelete: false
      }
    })
  } 
  catch(e) {
    console.error(e)
  }

}