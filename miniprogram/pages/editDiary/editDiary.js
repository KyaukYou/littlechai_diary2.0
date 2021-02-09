// pages/editDiary/editDiary.js
// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: true,
    globalData: {},
    toastTitle: "结束日期超出开始日期，为避免丢失日记信息，请重新选择日期时间段",
    toastDuration: 4500,
    toastBol: false,
    showBeginDate: false,
    showEndDate: false,
    minDate1: new Date(2021,0,1).getTime(),
    default_date: new Date().getTime(),
    maxDate1: "",
    minDate2: new Date().getTime(),
    maxDate2: "",
    info: {
      title: "",
      title_image: {
        type: 'default',
        url: "/images/wx.png"
      },
      location: "",
      beginDate: "",
      endDate: "",
      lock: false,
      show: true,
      sort: true,
      createdTime: "",
      updatedTime: "",
      ifDelete: false,
      ifTop: false,
      dayNum: 0,
      openid: ""
    },
    diaryArr: [
    ],
    id: "",
    uploadIcon: "",
    uploadDuration: 99999,
    uploadTitle: "",
    uploadBol: false,
    trueData: {},
    showCal: false,
    getBol: false,

    chatsBol: false,
    chatsIndex: 0,
    chatsName: '',
    chatsOpenid: '',
    loginBol: false,
    loginTitle: '',
    loginDuration: 0,
    loginIcon: '',
    commentArr: [],
    commentNum: 0,
    commentBol: false
  },
  // 初始化自定义导航栏
  async firstHeader() {
    this.setData({
      globalData: app.globalData
    })
  },
  async getData() {
    let res = await wx.cloud.callFunction({
      name: 'getMyDiary',
      data: {
        id: this.data.id,
        openid: wx.getStorageSync('openid')
      }
    })    
    console.log(res)
    let result = res.result.data[0]
    let copyInfo = JSON.parse(JSON.stringify(this.data.info))
    let copyArr = JSON.parse(JSON.stringify(this.data.diaryArr))
    copyInfo.title = result.title;
    copyInfo.title_image = result.title_image;
    copyInfo.location = result.location;
    copyInfo.beginDate = result.beginDate;
    copyInfo.endDate = result.endDate;
    copyInfo.lock = result.lock;
    copyInfo.show = result.show;
    copyInfo.sort = result.sort;
    copyInfo.createdTime = result.createdTime;
    copyInfo.updatedTime = result.updatedTime;
    copyInfo.dayNum = result.dayNum;
    copyArr = result.diaryArr

    this.setData({
      trueData: result,
      info: copyInfo,
      diaryArr: copyArr,
      getBol: true
    })
    // this.sortFn({
    //   detail: {
    //     value: result.sort
    //   }
    // });
  },
  async getGlobalData() {
    let timer = setInterval(() => {
      if (app.globalData.initBol === true) {
        this.setData({
          globalData: app.globalData,
          refreshBol: false
        })
        clearInterval(timer);
      }
    }, 100)
  },
  // 输入标题
  changeTitle(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.title = e.detail.value;
    this.setData({
      info: copy
    })
  },
  //输入位置
  changeLocation(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.location = e.detail.value;
    this.setData({
      info: copy
    })
  },
  // 选择位置
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        let copy = JSON.parse(JSON.stringify(this.data.info))
        copy.location = res.name + '(' + res.address + ')'
        this.setData({
          info: copy
        })
      },
      fail: (res) => {

      }
    })
  },
  // 显示开始日期框
  showBeginDateBol() {
    this.setData({
      showBeginDate: true,
      showCal: true
    })
  },

  // 显示结束日期框
  showEndDateBol() {
    this.setData({
      showEndDate: true,
      showCal: true
    })
  },

  //选择开始日期
  async selectBeginDate(e) {
    console.log(e)
    let copy = JSON.parse(JSON.stringify(this.data.info))
    let trueDate = await app.timeStamp(e.detail)
    copy.beginDate = trueDate;

    let y = trueDate.split('-')[0];
    let m = trueDate.split('-')[1];
    let d = trueDate.split('-')[2];
    console.log(y, m, d)

    let endDate = 0
    let beginDate = new Date(trueDate).getTime();
    if (this.data.info.endDate != "") {
      endDate = new Date(this.data.info.endDate).getTime();
    }
    console.log(endDate)
    if (endDate < beginDate && endDate !== 0) {
      // 提示
      this.setData({
        toastBol: true
      })
    } else {
      if (e.type === "linconfirm") {
        let res = await app.getdiffdate(copy.beginDate, copy.endDate)
        await this.initArr(res)
      }
    }
    this.setData({
      info: copy,
      showCal: false,
      minDate2: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime()
    })

  },
  //选择结束日期
  async selectEndDate(e) {
    console.log(e)
    let copy = JSON.parse(JSON.stringify(this.data.info))
    let trueDate = await app.timeStamp(e.detail)
    copy.endDate = trueDate;
    this.setData({
      info: copy,
      showCal: false,
    })
    if (e.type === "linconfirm") {
      let res = await app.getdiffdate(copy.beginDate, copy.endDate)
      await this.initArr(res)
    }

  },

  // 锁定解锁
  lockFn(e) {
    console.log(e)
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.lock = e.detail.value;
    this.setData({
      info: copy
    })
  },

  // 显示隐藏
  showFn(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.show = e.detail.value;
    this.setData({
      info: copy
    })
  },
  // 排序
  sortFn(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.sort = e.detail.value;
    let copyArr = JSON.parse(JSON.stringify(this.data.diaryArr))
    this.setData({
      info: copy,
      diaryArr: copyArr.reverse()
    })
    // if(e.detail.value === false) {
    //   this.setData({
    //     info: copy,
    //     diaryArr: copyArr.reverse()
    //   })
    // }
    // else {
    //   this.setData({
    //     info: copy
    //   })
    // }
  },




  // 同步修改日记数组，核心算法
  async initArr(arr) {
    console.log(arr)
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr))
    if(this.data.info.sort === false) {
      copy.reverse();
    }
    //判断copy中有没有改日期内的数组

    //原本为空，直接赋值
    if (copy.length <= 0) {
      for (var i = 0; i < arr.length; i++) {
        let obj = {
          date: arr[i],
          show: true,
          content: "",
          imagesArr: []
        }
        copy.push(obj)
      }
      if(this.data.info.sort === false) {
        this.setData({
          diaryArr: copy.reverse()
        })
      }
      else {
        this.setData({
          diaryArr: copy
        })
      }
      
      return;
    }

    let beginTime1 = await app.dateToTimestamp(copy[0].date);
    let beginTime2 = await app.dateToTimestamp(arr[0]);
    let endTime1 = await app.dateToTimestamp(copy[copy.length - 1].date);
    let endTime2 = await app.dateToTimestamp(arr[arr.length - 1]);

    //开始日期比原来前
    // 2021-01-24  < 2021-01-26
    if (beginTime1 < beginTime2) {
      console.log('开始日期比原来前')
      let sliceIndex = null;
      //把前面的截取
      for (let j = 0; j < copy.length; j++) {
        if (await app.dateToTimestamp(copy[j].date) === await app.dateToTimestamp(arr[0])) {
          sliceIndex = j;
        }
      }
      copy = copy.slice(sliceIndex)
      console.log(copy)

    }

    //开始日期和原来一样
    // 2021-01-24  === 2021-01-24
    if (beginTime1 === beginTime2) {
      console.log('开始日期和原来一样')

      //判断结束日期
      //比原来早 2021-01-28 > 2021-01-27

      if (endTime1 > endTime2) {
        let num = null;
        for (let x = 0; x < copy.length; x++) {
          if (await app.dateToTimestamp(copy[x].date) === endTime2) {
            num = x;
          }
        }
        copy.splice(num + 1, copy.length - 1)
      }
      //和原来一样

      //比原来晚 2021-01-28 < 2021-01-29
      if (endTime1 < endTime2) {
        let num = null;
        let res = await app.getdiffdate(copy[copy.length - 1].date, arr[arr.length - 1]);
        console.log(res)
        for (let x = 1; x < res.length; x++) {
          let obj = {
            date: res[x],
            show: true,
            content: "",
            imagesArr: []
          }
          copy.push(obj)
        }
      }

    }


    //开始日期比原来后
    // 2021-01-24  > 2021-01-22
    if (beginTime1 > beginTime2) {
      console.log('开始日期比原来后')
      let res = await app.getdiffdate(arr[0], copy[0].date);
      res.reverse();
      for (let x = 1; x < res.length; x++) {
        let obj = {
          date: res[x],
          show: true,
          content: "",
          imagesArr: []
        }
        copy.unshift(obj)
      }
    }

    if(this.data.info.sort === false) {
      this.setData({
        diaryArr: copy.reverse()
      })
    }
    else {
      this.setData({
        diaryArr: copy
      })
    }
    
    this.setData({
      showCal: false
    })

  },

  // 显示隐藏日记
  showArr(e) {
    let index = e.currentTarget.dataset.index;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr))
    copy[index].show = !copy[index].show
    this.setData({
      diaryArr: copy
    })
  },

  // 记录日记内容
  changeTextarea(e) {
    let index = e.currentTarget.dataset.index;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    copy[index].content = e.detail.value;
    this.setData({
      diaryArr: copy
    })
  },

  //选择日记封面
  async chooseTitleImage() {
    let res = await wx.chooseImage({
      count: 1,
    })
    console.log(res)
    let filePath = res.tempFilePaths[0];
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.title_image = {
      type: 'new',
      url: filePath
    }
    this.setData({
      info: copy
    })
  },

  //选择日记独立图片
  async chooseDiaryImage(e) {
    let index = e.currentTarget.dataset.index;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    let chooseNum = 9 - copy[index].imagesArr.length
    let res = await wx.chooseImage({
      count: chooseNum,
    })
    let filePathArr = res.tempFilePaths;
    for (let i = 0; i < filePathArr.length; i++) {
      let obj = {
        type: "new",
        url: filePathArr[i]
      }
      copy[index].imagesArr.push(obj)
    }
    this.setData({
      diaryArr: copy
    })
  },

  //删除日记独立图片
  delDiaryImage(e) {
    let index1 = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    copy[index1].imagesArr.splice(index2,1);
    this.setData({
      diaryArr: copy
    })
  },

  //查看大图
  watchBgImg(e) {
    let index1 = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    let list = [];
    let getArr = copy[index1].imagesArr;
    for(let i=0; i<getArr.length; i++) {
      list.push(getArr[i].url)
    }

    wx.previewImage({
      current: copy[index1].imagesArr[index2].url, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  //点击上传
  async upload() {
    let copy = JSON.parse(JSON.stringify(this.data.info));
    let copyDiary = JSON.parse(JSON.stringify(this.data.diaryArr));
    if(copy.title === "" || copy.title_image.type === 'default' || copy.location === "" || copy.beginDate === "" || copy.endDate === "") {
      this.setData({
        uploadIcon: "",
        uploadDuration: 2000,
        uploadTitle: "请填写完整",
        uploadBol: true
      })
      let maskTimer = setTimeout(() => {
        this.setData({
          uploadBol: false
        })
        clearTimeout(maskTimer)
      },2000)
    }
    else {
      //上传封面图
      if(this.data.info.title_image.type === 'new') {
        this.setData({
          uploadIcon: "loading",
          uploadDuration: 99999,
          uploadTitle: "更新封面中",
          uploadBol: true
        })
        let titleImageUrl = await this.uploadTitleImage(copy);
        copy.title_image.type = 'old';
        copy.title_image.url = titleImageUrl.fileID;
        // titleImageUrl.fileID
        console.log(titleImageUrl)
      }

        //上传日记独立封面
        let diaryImageNum = 0;
        let diaryImageIndex = 0;
        for(let i=0; i<copyDiary.length; i++) {
          for(let x=0; x<copyDiary[i].imagesArr.length; x++) {
            if(copyDiary[i].imagesArr[x].type === 'new') {
              diaryImageNum ++;
             }
          }
        }
      

      if(diaryImageNum === 0) {
        //直接上传
        let res = await this.uploadAll(copy,copyDiary)
      }

      else {
        //上传图片
        diaryImageIndex++;
        this.setData({
          uploadIcon: "loading",
          uploadDuration: 99999,
          uploadTitle: `更新图片中${diaryImageIndex}/${diaryImageNum}`,
          uploadBol: true
        })

        for(let i=0; i<copyDiary.length; i++) {
          for(let j=0; j<copyDiary[i].imagesArr.length; j++) {
            if(copyDiary[i].imagesArr[j].type === 'new') {
              let res = await this.uploadDiaryImage(copyDiary[i].imagesArr[j].url);
              copyDiary[i].imagesArr[j].url = res.fileID;
              copyDiary[i].imagesArr[j].type = 'old';
              diaryImageIndex++;
              this.setData({
                uploadIcon: "loading",
                uploadDuration: 99999,
                uploadTitle: `更新图片中${diaryImageIndex}/${diaryImageNum}`,
                uploadBol: true
              })
            }
          }
        }
        let res = await this.uploadAll(copy,copyDiary)

      }

      

    }
  },
  async uploadTitleImage(val) {
    let pattern = /\.{1}[a-z]{1,}$/;
    let cc = val.title_image.url.slice(0, pattern.exec(val.title_image.url).index);
    cc = cc.slice(11);
    let openid = wx.getStorageSync('openid');
    let cloudPath = 'user/' + openid + '/diary/' + cc + val.title_image.url.match(/\.[^.]+?$/)[0];
    let filePath = val.title_image.url
    let res = await wx.cloud.uploadFile({
      cloudPath,
      filePath,
    })
    return res
  },
  async uploadDiaryImage(val) {
    let pattern = /\.{1}[a-z]{1,}$/;
    let cc = val.slice(0, pattern.exec(val).index);
    cc = cc.slice(11);
    let openid = wx.getStorageSync('openid');
    let cloudPath = 'user/' + openid + '/diary/' + cc + val.match(/\.[^.]+?$/)[0];
    let filePath = val
    let res = await wx.cloud.uploadFile({
      cloudPath,
      filePath,
    })
    return res
  },
  async uploadAll(val1,val2) {
    console.log(val1,val2);
    this.setData({
      uploadIcon: "loading",
      uploadDuration: 99999,
      uploadTitle: `更新内容中`,
      uploadBol: true
    })
    val1.createdTime = await app.timeStampX(new Date().getTime());
    val1.updatedTime = await app.timeStampX(new Date().getTime());
    val1.diaryArr = val2;
    val1.openid = wx.getStorageSync('openid');
    val1.dayNum = val2.length;
    const diarySchema = val1;

    let res = await wx.cloud.callFunction({
      name: 'updateDiary',
      data: {
        diary: diarySchema,
        id: this.data.id,
        openid: wx.getStorageSync('openid')
      }
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      this.setData({
        uploadIcon: "success",
        uploadDuration: 1000,
        uploadTitle: `更新成功`,
        uploadBol: true
      })
      let timer = setTimeout(() => {
        this.setData({
          uploadBol: false
        })
        clearTimeout(timer);
      },1000)
    }

  },


  // 评论事件
  // 评论头像点击
  toUsers(e) {
    wx.navigateTo({
      url: '../userInfo/userInfo?id=' + e.currentTarget.dataset.openid,
    })
  },
  // 评论内容
  getChat(e) {
    this.setData({
      chatData: e.detail.value
    })
  },
  //回复评论
  async uploadChat() {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      this.setData({
        loginBol: true,
        loginTitle: '请先登录',
        loginDuration: 1500
      })
      return;
    }

    if (this.data.chatData == '') {
      this.setData({
        loginBol: true,
        loginTitle: '请输入内容',
        loginDuration: 2000
      })
    } 
    else {
      this.setData({
        loginBol: true,
        loginIcon: 'loading',
        loginTitle: '评论中',
        loginDuration: 99999
      })
  
      //楼中楼
      if(this.data.chatsBol) {  
        let time = await app.timeStampX(new Date().getTime());

        let res = await wx.cloud.callFunction({
          name: 'uploadComment',
          data: {
            diary_id: this.data.id,
            updatedTime: time,
            openid: wx.getStorageSync('openid'),
            comment_openid: this.data.chatsOpenid,
            comment_index: this.data.chatsIndex,
            bol: true,
            content: this.data.chatData
          }
        })
        console.log(res)
        if(res.result.errMsg === "collection.update:ok") {
          this.setData({
            loginBol: true,
            loginIcon: 'success',
            loginTitle: '评论成功',
            loginDuration: 1500,
            chatData: '',
            chatsName: '',
            chatsOpenid: '',
            pText: '留下你的评论呀~',
            chatsBol: false
          })

          this.getComment();
        }

      }
      //正常评论
      else {
        let time = await app.timeStampX(new Date().getTime());

        let res = await wx.cloud.callFunction({
          name: 'uploadComment',
          data: {
            diary_id: this.data.id,
            updatedTime: time,
            createdTime: time,
            openid: wx.getStorageSync('openid'),
            bol: false,
            content: this.data.chatData
          }
        })

        if(res.result.errMsg === "collection.update:ok") {
          this.setData({
            loginBol: true,
            loginIcon: 'success',
            loginTitle: '评论成功',
            loginDuration: 1500,
            chatData: ""
          })

          this.getComment();
        }
         
      }
    }

  },

  //获得评论内容
  async getComment() {
    console.log(this.data.id)
    let res = await wx.cloud.callFunction({
      name: 'getComment',
      data: {
        diary_id: this.data.id
      }
    })
    console.log(res)
    let num = 0;
    for(let i=0; i<res.result.length; i++) {
      num++;
      for(let j=0; j<res.result[i].arr.length; j++) {
        num++
      }
    }
    this.setData({
      commentArr: res.result,
      commentNum: num
    })
  },

  //楼中楼
  chattochat(e) {
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    this.setData({
      chatsIndex: index,
      chatsName: name,
      chatData: '',
      pText: '回复：'+ name,
      chatsBol: true,
      chatsOpenid: e.currentTarget.dataset.openid
    })
  },

  //取消楼中楼
  cancelChats() {
    this.setData({
      chatData: '',
      chatsName: '',
      chatsOpenid: '',
      pText: '留下你的评论呀~',
      chatsBol: false
    })
  },

  //获得评论权限
  async getCommentBol() {
    let res = await wx.cloud.callFunction({
      name: 'getCommentBol'
    })
    console.log(res)
    if(res.result.errMsg === "collection.get:ok") {
      this.setData({
        commentBol: res.result.data[0].controlChat,
        refreshBol: false
      })

      if(res.result.data[0].controlChat === true) {
        this.getComment();
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.init();
  },

  async init() {
    this.getGlobalData();
    await this.getData();
    await this.getCommentBol();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})