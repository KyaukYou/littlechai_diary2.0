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
    await db.collection('users').where({
      openid: event.openid
    })
    .update({
      data: {
        following: _.push(event.userOpenid),
        following_num: _.inc(1)
      }
    })

    let res = await db.collection('users').where({
      openid: event.userOpenid
    })
    .update({
      data: {
        fans: _.inc(1)
      }
    })
    return res

  } 
  catch(e) {
    console.error(e)
  }

}