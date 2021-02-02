// pages/diaryDetail/diaryDetail.js
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
    refreshBol: false,
    id: '',
    info: {},
    diaryArr: []
  },
  refresh() {
    this.setData({
      refreshBol: true
    })
    
  },

  async getDiaryDetail() {
    let res = await wx.cloud.callFunction({
      name: 'getDiaryDetail',
      data: {
        id: this.data.id
      }
    })

    if(res.result.errMsg === "collection.get:ok") {
      this.setData({
        info: res.result.data[0],
        diaryArr: res.result.data[0].diaryArr,
        loadingBol: false
      })
    }

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
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
      // id: '1526e12a6016b30b019533d22860cb09'
    })  
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
    this.setData({
      loadingBol: true,
      loadingIcon: 'loading',
      loadingTitle: '加载中',
      loadingDuration: 99999
    })
    this.getDiaryDetail()
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