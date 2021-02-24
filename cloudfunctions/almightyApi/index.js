// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {

  if (event.type === 'getFollow') {

    let res = await db.collection('users').where({
        openid: event.openid
      })
      .field({
        following: true
      })
      .get()
    if (res.data.length > 0) {
      let arr = JSON.parse(JSON.stringify(res.data[0].following))
      let resArr = [];
      for (let i = 0; i < arr.length; i++) {
        let user = await db.collection('users').where({
          openid: arr[i]
        }).field({
          'userInfo.nickName': true,
          'userInfo.avatarUrl': true,
          'userInfo.gender': true,
          openid: true
        }).get();

        let obj = {
          userInfo: user.data[0].userInfo,
          openid: user.data[0].openid
        }
        resArr.push(obj)
      }
      return resArr;
    } else {
      return [];
    }

  } else if (event.type === 'getMyFollow') {
    let res = await db.collection('users').where({
        openid: event.openid
      })
      .field({
        following: true
      })
      .get()
    if (res.data.length > 0) {
      let arr = JSON.parse(JSON.stringify(res.data[0].following))
      let resArr = [];
      for (let i = 0; i < arr.length; i++) {
        let user = await db.collection('users').where({
          openid: arr[i]
        }).field({
          'userInfo.nickName': true,
          'userInfo.avatarUrl': true,
          'userInfo.gender': true,
          openid: true
        }).get();

        let obj = {
          userInfo: user.data[0].userInfo,
          openid: user.data[0].openid
        }
        resArr.push(obj)
      }
      return resArr;
    } else {
      return [];
    }
  } else if (event.type === 'getFans') {
    let res = await db.collection('users').where({
        following: event.openid
      })
      .field({
        'userInfo.nickName': true,
        'userInfo.avatarUrl': true,
        'userInfo.gender': true,
        openid: true
      })
      .get()

    return res.data;

  } else if (event.type === 'getDiaryNo') {
    // 第几页
    let page = Math.max(event.page * 1, 1) - 1;

    // 每页几项
    let perPage = Math.max(event.per_page * 1, 1);

    //排序方式
    let sortName = '';
    let sortValue = 'desc'
    if (event.sort === 'updatedTimeA') {
      sortName = 'updatedTime';
    } else if (event.sort === 'updatedTimeB') {
      sortName = 'updatedTime';
      sortValue = 'asc'
    } else if (event.sort === 'like') {
      sortName = 'like';
    } else if (event.sort === 'see') {
      sortName = 'see';
    }


    let res = await db.collection('diarys')
      .orderBy(sortName, sortValue)
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
      .limit(perPage)
      .skip(page * perPage)
      .get()

    for (let i = 0; i < res.data.length; i++) {
      let user = await db.collection('users').where({
        openid: res.data[i].openid
      }).field({
        'userInfo.nickName': true,
        'userInfo.avatarUrl': true,
        openid: true
      }).get();
      if(user.data.length > 0) {
        res.data[i].userInfo = user.data[0].userInfo
        res.data[i].userInfo.openid = user.data[0].openid
      }
      
    }

    return res;
  } else if (event.type === 'getDiary') {
    // 第几页
    let page = Math.max(event.page * 1, 1) - 1;

    // 每页几项
    let perPage = Math.max(event.per_page * 1, 1);

    //排序方式
    let sortName = '';
    let sortValue = 'desc'
    if (event.sort === 'updatedTimeA') {
      sortName = 'updatedTime';
    } else if (event.sort === 'updatedTimeB') {
      sortName = 'updatedTime';
      sortValue = 'asc'
    } else if (event.sort === 'like') {
      sortName = 'like';
    } else if (event.sort === 'see') {
      sortName = 'see';
    }


    let res = await db.collection('diarys').where(_.or(
          [{
              title: db.RegExp({
                regexp: event.value,
                option: 'i'
              })
            },
            {
              location: db.RegExp({
                regexp: event.value,
                option: 'i'
              })
            }
          ]
        )
        .and([{
          show: true,
          ifDelete: false,
          openid: event.openid
        }])
      )
      .orderBy(sortName, sortValue)
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
      .limit(perPage)
      .skip(page * perPage)
      .get()

    for (let i = 0; i < res.data.length; i++) {
      let user = await db.collection('users').where({
        openid: res.data[i].openid
      }).field({
        'userInfo.nickName': true,
        'userInfo.avatarUrl': true,
        openid: true
      }).get();
      if(user.data.length > 0) {
        res.data[i].userInfo = user.data[0].userInfo
        res.data[i].userInfo.openid = user.data[0].openid
      }
    }

    return res;
  } else if (event.type === 'getMyDiary') {
    return await db.collection('diarys').where({
        _id: event.id,
      })
      .get()
  } else if (event.type === 'getUsers') {
    // 第几页
    let page = Math.max(event.page * 1, 1) - 1;

    // 每页几项
    let perPage = Math.max(event.per_page * 1, 1);


    let res = await db.collection('users')
      .orderBy('created_time', 'desc')
      .field({
        'userInfo.nickName': true,
        'userInfo.avatarUrl': true,
        'userInfo.gender': true,
        openid: true,
        created_time: true,
        updated_time: true,
      })
      .limit(perPage)
      .skip(page * perPage)
      .get()

    return res;
  }
  else if(event.type === 'adminGetUserInfo') {
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
  
    // if(res.data[0].secret === true) {
      // let result = res.data[0]
      // let obj = {
      //   userInfo: result.userInfo,
      //   background_bol: result.background_bol,
      //   background_url: result.background_url,
      //   blur: result.blur,
      //   color: result.color,
      //   secret: result.secret
      // }
      // return obj;
    // }
    // else {
      if(res.data.length > 0) {
        let obj = res.data[0]
        return obj;
      }
      
    // }
  }
  
}