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
      bottom: "7%"
    },
    screenHeight: 0, 
    screenWidth: 0, 
    toastBol: false,
    toastTitle: "",
    toastDuration: 0,
    diaryArr: []
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
  // 初始化自定义导航栏
  async firstHeader() {
    this.setData({
      globalData: app.globalData
    })
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
  // 滚动到底部
  scrollToBottom(e) {
    console.log(e)
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
        page: 1,
        per_page: 5
      }
    })
    console.log(res.result.data)
    let arr = res.result.data;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    for(let j=0; j<arr.length; j++) {
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: arr
    })
   },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.onLoad();
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