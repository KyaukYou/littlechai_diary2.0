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
  let page = Math.max(event.page * 1,1) - 1;

  // 每页几项
  let perPage = Math.max(event.per_page * 1,1);

  let res = await db.collection('users').where({
    openid: event.openid
  })
  .field({
    collection: true
  })
  .get();
  // return res;
  let arr = []
  for(let i=0; i<res.data[0].collection.length; i++) {
    let resX = await db.collection('diarys').where(
      {
        show: true,
        ifDelete: false,
        _id: res.data[0].collection[i]
      }
    )
    .field({
      updatedTime: true,
      title: true,
      title_image: true,
      see: true,
      location: true,
      lock: true,
      like: true,
      dayNum: true,
      collection: true,
      openid: true
    })
    .get()
    if(resX.data.length != 0) {
      let user = await db.collection('users').where({
        openid: resX.data[0].openid
      })
      .field({
        userInfo: true
      })
      .get();
      resX.data[0].userInfo = user.data[0].userInfo
      arr.push(resX.data[0])
    }
  }  
  //a-b是从小到大
  //b-a是从大到小
  // 时间从大到小排序
  if(event.sort === 'updatedTimeA') {
    arr = arr.sort(function(a,b) {
      return new Date(b.updatedTime).getTime() - new Date(a.updatedTime).getTime();
    })
  }

  if(event.sort === 'updatedTimeB') {
    arr = arr.sort(function(a,b) {
      return new Date(a.updatedTime).getTime() - new Date(b.updatedTime).getTime();
    })
  }

  if(event.sort === 'like') {
    arr = arr.sort(function(a,b) {
      return b.like - a.like;
    })
  }

  if(event.sort === 'see') {
    arr = arr.sort(function(a,b) {
      return b.see - a.see;
    })
  }


  //筛选
  let filterArr = [];
  for(let x=0; x<arr.length; x++) {
    if(arr[x].title.includes(event.value) || arr[x].title.includes(event.value)) {
      filterArr.push(arr[x])
    }
  }
  let start = (event.page - 1) * event.per_page;
  let end = event.page * event.per_page;
  return filterArr.slice(start,end);

}