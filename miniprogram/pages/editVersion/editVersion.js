// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    verBol: false,
    verData: [],
    refreshBol: false,
    // 每页有几个
    perPage: 8,
    // 第几页
    page: 1
  },
  async getGlobalData() {
    let timer = setInterval(() => {
      if(app.globalData.initBol === true) {
        let data = JSON.parse(JSON.stringify(app.globalData));
        let colorX = data.color.split('rgb(')[1].split(')')[0].split(',')
        console.log(colorX)
        data.colorX = `rgba(${colorX[0]},${colorX[1]},${colorX[2]},0.8)`;
        this.setData({
          globalData: data,
          refreshBol: false
        })
        clearInterval(timer);
      }
    },100)
  },
  async getVersion() {
    let version = await wx.cloud.callFunction({
      name: 'getVersion',
      data: {
        page: this.page,
        perPage: this.perPage
      }
    })
    console.log(version)
    let arr = JSON.parse(JSON.stringify(version.result.data[0].arr));
    this.setData({
      verBol: true,
      verData: arr,
      refreshBol: false
    })
  },
  //scroll-view 自定义下拉刷新
  async refresh() {
    console.log('开始刷新')
    this.setData({
      refreshBol: true
    })
    await this.getVersion();
    this.getGlobalData();
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
    this.getVersion();
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