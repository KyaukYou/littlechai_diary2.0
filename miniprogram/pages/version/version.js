// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: true,
    globalData: {},
    verBol: false,
    verData: [],
    refreshBol: false,
    toastBol: true,
    toastTitle: '加载中',
    toastDuration: 999999,
    page: 1,
    pageSize: 6,
    maxPage: 1,
    allArr: [],
    updatedTime: ""
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
          refreshBol: false,
        })
        clearInterval(timer);
      }
    },100)
  },
  async getVersion() {
    let version = await wx.cloud.callFunction({
      name: 'getVersion'
    })
    console.log(version)
    let arr = JSON.parse(JSON.stringify(version.result.data[0].arr));
    let num1 = parseInt(arr.length / this.data.pageSize);
    let num2 = arr.length % this.data.pageSize;
    num2 <= 0 ? 0 : 1
    console.log(num1,num2)

    this.setData({
      verBol: true,
      toastBol: false,
      verData: arr.slice(0,this.data.page * this.data.pageSize),
      refreshBol: false,
      maxPage: num1+num2,
      allArr: arr,
      updatedTime: version.result.data[0].updatedTime
    })
  },
  //scroll-view 自定义下拉刷新
  async refresh() {
    console.log('开始刷新')
    this.setData({
      toastBol: true,
      refreshBol: true,
      page: 1
    })
    await this.getVersion();
    this.getGlobalData();
  },
  // 滑动到底部
  scrollToBottom(e) {
    console.log(e)
    if(this.data.page >= this.data.maxPage) {
      this.data.page = this.data.maxPage
    }
    else {
      let numX = this.data.page
      numX++
      this.setData({
        page: numX
      })
    }

    this.setData({
      verData: this.data.allArr.slice(0,this.data.page * this.data.pageSize),
    })

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
    this.getGlobalData();
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