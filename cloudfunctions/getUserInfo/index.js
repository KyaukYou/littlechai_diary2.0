// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let res = await db.collection('users').where({
    openid: event.openid
  })
  .field({
    userDetail:true,
    userInfo: true,
    background_bol: true,
    background_url: true,
    blur: true,
    collection_num: true,
    color: true,
    diary_num: true,
    fans: true,
    following_num: true,
    secret: true
  })
  .get()

  if(res.data[0].secret === true) {
    let result = res.data[0]
    let obj = {
      userInfo: result.userInfo,
      background_bol: result.background_bol,
      background_url: result.background_url,
      blur: result.blur,
      color: result.color,
      secret: result.secret
    }
    return obj;
  }
  else {
    let obj = res.data[0]
    return obj;
  }
  
  
}