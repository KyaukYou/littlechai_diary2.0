// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshBol: false,
    back: false,
    globalData: {},
    pos: {
      right: "8%",
      bottom: "5.4%"
    },
    screenHeight: 0, 
    screenWidth: 0, 
    toastBol: false,
    toastTitle: "",
    toastDuration: 0,
    diaryArr: [],
    page: 1,
    per_page: 6,
    openid: "",
    like: [],
    collection: []
  },
  toCreate() {
    if(wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/createDiary/createDiary',
      })
    }
    else {
      this.setData({
        toastBol: true,
        toastTitle: "请先登录",
        toastDuration: 2000
      })
    }
    
  },
  async getUserArr() {
    if(wx.getStorageSync('openid') && wx.getStorageSync('user')) {
      let res = await wx.cloud.callFunction({
        name: 'getUserArr',
        data: {
          openid: wx.getStorageSync('openid')
        }
      })
      console.log(res)
      this.setData({
        like: res.result.data[0].like,
        collection: res.result.data[0].collection
      })
    }
  },
  // 初始化自定义导航栏
  async firstHeader() {
    this.setData({
      globalData: app.globalData
    })
    await this.getUserArr();
  },
  async getGlobalData() {
    let timer = setInterval(() => {
      if(app.globalData.initBol === true) {
        this.setData({
          globalData: app.globalData,
          refreshBol: false
        })
        clearInterval(timer);
      }
    },100)
  },
  // 选项切换
  changeTabs(e) {
    console.log(e.detail.activeKey)
  },
  //scroll-view 自定义下拉刷新
  async refresh() {
    await this.getUserArr();
    this.setData({
      page: 1,
      per_page: 6,
    })
    await this.getDiaryX();
    // console.log('开始刷新')
    if(!wx.getStorageSync('openid')) {
      this.setData({
        refreshBol: false
      })
      return false;
    }
    this.setData({
      refreshBol: true
    })
    await app.initData();
    this.getGlobalData();
  },

  ballMoveEvent: function (e) { 
    console.log('我被拖动了....') 
    var touchs = e.touches[0]; 
    var pageX = touchs.pageX; 
    var pageY = touchs.pageY; 
    console.log('pageX: ' + pageX) 
    console.log('pageY: ' + pageY) 
  //防止坐标越界,view宽高的一般 
    if (pageX < 30) return; 
    if (pageX > this.data.screenWidth - 30) return; 
    if (this.data.screenHeight - pageY <= 30) return; 
    if (pageY <= 30) return;
  //这里用right和bottom.所以需要将pageX pageY转换 
    var x = this.data.screenWidth - pageX - 30; 
    var y = this.data.screenHeight - pageY - 30; 
    console.log('x: ' + x) 
    console.log('y: ' + y) 
    // let timer = setTimeout(() => {
      
    // },0)
    this.setData({ 
      pos: {
        right: ((x / this.data.screenWidth) * 100).toFixed(2) + '%',
        bottom: ((y / this.data.screenHeight) * 100).toFixed(2) + '%'
      }
     }); 
    
   }, 
   async getDiary() {
    let res = await wx.cloud.callFunction({
      name: 'getDiary',
      data: {
        page: this.data.page,
        per_page: this.data.per_page
      }
    })
    console.log(res.result.data,this.data.like,'----------------')
    let arr = res.result.data;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    for(let j=0; j<arr.length; j++) {
      if(this.data.like.includes(arr[j]._id)) {
        arr[j].inLike = true;
      }
      else {
        arr[j].inLike = false;
      }
      if(this.data.collection.includes(arr[j]._id)) {
        arr[j].inCollection = true;
      }
      else {
        arr[j].inCollection = false;
      }
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: copy
    })
   },

   async getDiaryX() {
    let res = await wx.cloud.callFunction({
      name: 'getDiary',
      data: {
        page: this.data.page,
        per_page: this.data.per_page
      }
    })
    console.log(res.result.data)
    let arr = res.result.data;
    let copy = [];
    for(let j=0; j<arr.length; j++) {
      if(this.data.like.includes(arr[j]._id)) {
        arr[j].inLike = true;
      }
      else {
        arr[j].inLike = false;
      }
      if(this.data.collection.includes(arr[j]._id)) {
        arr[j].inCollection = true;
      }
      else {
        arr[j].inCollection = false;
      }
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: copy
    })
   },
  //  滚动到底部
   async scrollToBottom() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page
    })
    let res = await wx.cloud.callFunction({
      name: 'getDiary',
      data: {
        page: this.data.page,
        per_page: this.data.per_page
      }
    })
    let arr = res.result.data;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));

    for(let j=0; j<arr.length; j++) {
      if(this.data.like.includes(arr[j]._id)) {
        arr[j].inLike = true;
      }
      else {
        arr[j].inLike = false;
      }
      if(this.data.collection.includes(arr[j]._id)) {
        arr[j].inCollection = true;
      }
      else {
        arr[j].inCollection = false;
      }
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: copy
    })


   },

  //  锁定解锁
  async lockDiary(e) {
    let that = this;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    let index = e.currentTarget.dataset.index;
    let openid = e.currentTarget.dataset.openid;
    if(openid === wx.getStorageSync('openid')) {
      wx.showModal({
        title: copy[index].lock === true ? '是否解锁' : '是否锁定',
        content: copy[index].lock === true ? '解锁后他人将能查看你的日记' : '锁定后他人将不能查看你的日记',
        success(val) {
          console.log(val)
          if(val.confirm === true) {
            wx.cloud.callFunction({
              name: 'lockDiary',
              data: {
                id: copy[index]._id,
                lock: !copy[index].lock
              },
              success(res) {
                if (res.result.stats.updated === 1) {
                  copy[index].lock = !copy[index].lock;
                  that.setData({
                    diaryArr: copy
                  })
                }
              }
            })
          }
        }   
      })
    }
    else {
      console.log('不是本人')
    }
  },
  toDetail(e) {
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    let index = e.currentTarget.dataset.index;
    let openid = e.currentTarget.dataset.openid;
    if(copy[index].lock == true) {
      if(copy[index].openid != wx.getStorageSync('openid')) {
        this.setData({
          toastBol: true,
          toastTitle: "日记被锁定",
          toastDuration: 2000
        })
      }
      else {
        // 跳转
      }
    }
  },

  //点赞
  async setLike(e) {

    if(wx.getStorageSync('openid')) {
      let that = this;
      let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
      let index = e.currentTarget.dataset.index;
      let openid = e.currentTarget.dataset.openid;

      //判断是否已经点赞
      if(copy[index].inLike === false) {
        //还未点赞
        let copyLike = JSON.parse(JSON.stringify(this.data.like));
        copyLike.push(copy[index]._id)
        let res = await wx.cloud.callFunction({
          name: 'setUserLikeNum',
          data: {
            openid: wx.getStorageSync('openid'),
            num: 1,
            like: copyLike
          }
        })
        if(res.result.stats.updated === 1) {
          copy[index].inLike = true;
          copy[index].like++;
          this.setData({
            diaryArr: copy,
            like: copyLike
          })  
        }
      }
      if(copy[index].inLike === true) {
        //已经点赞
        let spliceIndex = null;
        let copyLike = JSON.parse(JSON.stringify(this.data.like));
        for(let i=0; i<this.data.like.length; i++) {
          if(this.data.like[i] === copy[index]._id) {
            spliceIndex = i;
          }
        }
        if(spliceIndex != null) {
          copyLike.splice(spliceIndex,1)
        }
        let res = await wx.cloud.callFunction({
          name: 'setUserLikeNum',
          data: {
            openid: wx.getStorageSync('openid'),
            num: -1,
            like: copyLike
          }
        })
        if(res.result.stats.updated === 1) {
          copy[index].inLike = false;
          copy[index].like--;
          this.setData({
            diaryArr: copy,
            like: copyLike
          })  
        }
      }

    }
    else {
      this.setData({
        toastBol: true,
        toastTitle: "请先登录",
        toastDuration: 2000
      })
    }
  },

  setCollection() {
    if(wx.getStorageSync('openid')) {
     
    }
    else {
      this.setData({
        toastBol: true,
        toastTitle: "请先登录",
        toastDuration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    // this.onLoad();
    var that = this; 
    wx.getSystemInfo({ 
    success: function (res) { 
      that.setData({ 
      screenHeight: res.windowHeight, 
      screenWidth: res.windowWidth, 
      }); 
    } 
    }); 
    this.firstHeader();
    this.getGlobalData();
    this.getDiary();
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