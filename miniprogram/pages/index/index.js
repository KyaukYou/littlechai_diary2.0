// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshBol: false,
    globalData: {}
  },
  toCreate() {
    wx.navigateTo({
      url: '/pages/createDiary/createDiary',
    })
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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