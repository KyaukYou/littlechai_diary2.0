// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  // let page = Math.max(event.page * 1,1) - 1;
  return  await db.collection('versions').where({
    _id: 'b00064a760058d190002596d0fff0b4f'
  })
  .field({
    _id: false,
    arr: true,
    version: true
  })
  .get()
  
}