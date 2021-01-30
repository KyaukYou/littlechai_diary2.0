// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const user = await db.collection('users').where({
    openid: event.openid
  })
  .field({
    background_bol: true,
    background_Url: true,
    blur: true,
    collection_num: true,
    color: true,
    diary_num: true,
    fans:true,
    following_num: true,
    hue: true,
    like_num: true,
    openid: true,
    roles: true,
    userInfo: true
  })
  .get()

  if(user.data.length > 0) {

    db.collection('users').where({
      openid: event.openid
    }).update({
      data: {
        updated_time: event.time
      }
    })

    return {
      status: 'ok',
      data: user.data[0]
    }
  }
  else {
    return {
      status: 'err'
    }
  }

}