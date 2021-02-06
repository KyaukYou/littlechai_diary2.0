// pages/userInfo/userInfo.js
// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: true,
    refreshBol: false,
    globalData: {},
    toastBol: '',
    toastTitle: '',
    toastDuration: 99999,
    id: '',
    info: {}
  },
  // 初始化自定义导航栏
  async firstHeader() {
    this.setData({
      globalData: app.globalData
    })
  },
 

  //scroll-view 自定义下拉刷新
  async refresh() {
    this.setData({
      refreshBol: true
    })

    this.getUserInfo()

  },

  //跳转到我的日记
  toMyDiary() {
    wx.navigateTo({
      url: '/pages/myDiary/myDiary',
    })
  },

  //跳转到我的收藏
  toMyCollection() {
    wx.navigateTo({
      url: '/pages/myCollection/myCollection',
    })
  },

  async getUserInfo() {
      let res = await wx.cloud.callFunction({
        name: 'getUserInfo',
        data: {
          openid: this.data.id
        }
      })
      this.setData({
        info: res.result,
        refreshBol: false
      })
      console.log(res)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    this.firstHeader();
    this.getUserInfo()
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