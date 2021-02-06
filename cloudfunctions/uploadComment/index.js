// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command


// diary_id: this.data.id,
// updatedTime: time,
// createdTime: time,
// openid: wx.getStorageSync('openid'),
// bol: false,
// content: this.data.chatData

// 云函数入口函数
exports.main = async (event, context) => {

  try {
    let comment = await db.collection('comments').where({
      diary_id: event.diary_id,
    })
    .get()

    //该日记没有评论
    if(comment.data.length <= 0) {

      //先创建
      await db.collection('comments').add({
        data: {
          diary_id: event.diary_id,
          updatedTime: event.updatedTime,
          createdTime: event.createdTime,
          arr: []
        }
      })

      let res = await db.collection('comments').where({
        diary_id: event.diary_id,
      })
      .update({
        data: {
          updatedTime: event.updatedTime,
          arr: _.push({
            content: event.content,
            openid: event.openid,
            updatedTime: event.updatedTime,
            arr: []
          })
        }
      })

      return res;

    }

    //有评论
    else {

      //一级评论
      if(event.bol === false) {
        let res = await db.collection('comments').where({
          diary_id: event.diary_id,
        })
        .update({
          data: {
            updatedTime: event.updatedTime,
            arr: _.push({
              content: event.content,
              openid: event.openid,
              updatedTime: event.updatedTime,
              arr: []
            })
          }
        })
  
        return res;
      }

      //二级评论
      else if(event.bol === true) {
        let res = await db.collection('comments').where({
          diary_id: event.diary_id,
        })
        .update({
          data: {
            updatedTime: event.updatedTime,
            [`arr.${event.comment_index}.arr`]: _.push(
              {
                content: event.content,
                openid: event.openid,
                updatedTime: event.updatedTime,
                comment_openid: event.comment_openid
              }
            )
          }
        })
        return res;
      }

    }
   
  } 
  catch(e) {
    console.error(e)
  }

}