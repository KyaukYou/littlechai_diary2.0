// pages/uploadQuestion/uploadQuestion.js
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
    textarea: ""
  },
  changeValue(e) {
    this.setData({
      textarea: e.detail.value
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
  //提交问题
  async uploadQuestion() {
    let that = this;
    if(this.data.textarea.length < 1) {
      this.setData({
        loadingBol: true,
        loadingIcon: 'error',
        loadingTitle: '请填写问题',
        loadingDuration: 2000
      })
    }
    else {
      let openid = wx.getStorageSync('openid');
      this.setData({
        loadingBol: true,
        loadingIcon: 'loading',
        loadingTitle: '提交中',
        loadingDuration: 99999
      })
      let res = await wx.cloud.callFunction({
        name: 'uploadQuestion',
        data: {
          openid: openid,
          question: this.data.textarea,
          updatedTime: await app.timeStampX(new Date().getTime())
        }
      })
      console.log(res)
      if(res.errMsg === "cloud.callFunction:ok") {
        this.setData({
          loadingBol: true,
          loadingIcon: 'success',
          loadingTitle: '提交成功',
          loadingDuration: 800
        })
        let timer = setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
          clearTimeout(timer)
        },800)
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    // this.setData({
    //   loadingBol: false,
    //   loadingIcon: 'loading',
    //   loadingTitle: '提交中',
    //   loadingDuration: 99999
    // })
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