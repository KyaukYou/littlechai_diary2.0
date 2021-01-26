// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  // 第几页
  let page = parseInt(event.page);

  // 每页几项
  const perPage = parseInt((page-1) * event.per_page);

  return await db.collection('diarys').where({
    show: true,
    ifDelete: false
  })
  .field({
    updatedTime: true,
    title: true,
    title_image: true,
    see: true,
    location: true,
    lock: true,
    like: true,
    dayNum: true,
    collection: true
  })
  .limit(event.per_page)
  .skip(perPage)
  .get()

}