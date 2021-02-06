// pages/myQuestionDetail/myQuestionDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    back: true,
    loadingBol: false,
    loadingIcon: '',
    loadingTitle: '',
    loadingDuration: 99999,
    questionDetail: {},
    refreshBol: false

  },
  refresh() {
    this.setData({
      refreshBol: true
    })
    this.getQuestionDetail();
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
  //获取问题数据
  async getQuestionDetail(id) {
    let arr = []
    let res = await wx.cloud.callFunction({
      name: 'getMyQuestionDetail',
      data: {
        id: id,
      }
    })
    let info = res.result.data[0];
    console.log(info)
    this.setData({
      questionDetail: info,
      loadingBol: false,
      loadingIcon: 'success',
      loadingTitle: '加载成功',
      loadingDuration: 0,
      refreshBol: false
    })
  },

  toUsers(e) {
    wx.navigateTo({
      url: '../userInfo/userInfo?id=' + e.currentTarget.dataset.openid,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGlobalData();
    this.setData({
      loadingBol: true,
      loadingIcon: 'loading',
      loadingTitle: '加载中',
      loadingDuration: 99999,
      id: options.id
    })
    this.getQuestionDetail(options.id)
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