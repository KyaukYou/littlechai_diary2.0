// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshBol: false,
    globalData: {},
    rgb: 'rgb(0,0,0)',//初始值
    pick: false,
    header_image: "",
    header_imageX: "",
    color: "",
    info: {},
    toastBol: false,
    toastTitle: '登录中',
    toastDuration: 999999
  },
  // 颜色等自定义同步云函数
  async syncCustom(val) {
    // console.log(val)
    if(wx.getStorageSync('openid')) {
      let res = await wx.cloud.callFunction({
        name: 'updateCustom',
        data: {
          update: val,
          openid: wx.getStorageSync('openid')
        }
      })
      console.log(res)
      if(res.result.stats.updated === 1) {
        await app.initData();
        this.getGlobalData();
      }
    }
    else {
      this.getGlobalData();
    }
  },
  // 显示取色器
  toPick: function () {
    this.setData({
      pick: true
    })
  },
  //取色结果回调
  pickColor(e) {
    console.log(e)
    let rgb = e.detail.color;
    app.changeColor(rgb);
    wx.setStorageSync('color', rgb);
    // this.getGlobalData();
    this.syncCustom({
      color: rgb,
      hue: wx.getStorageSync('hue') ? wx.getStorageSync('hue') : 347
    })
  },
  getGlobalData() {
    let timer = setInterval(() => {
      // console.log(app.globalData.initBol)
      if(app.globalData.initBol === true) {
        clearInterval(timer)
        this.setData({
          globalData: app.globalData,
          rgb:app.globalData.color,
          color: app.globalData.background === true ? "" : app.globalData.color
        })
        if(wx.getStorageSync('user')) {
          let res = wx.getStorageSync('user');
          this.setData({
            info: {
              diary_num: res.diary_num,
              collection_num: res.collection_num,
              following_num: res.following_num,
              fans: res.fans
            }
          })
        }
        this.setData({
          toastBol: false,
          refreshBol: false
        })
        
      }
      // console.log(app.globalData)
    },100)
  },
  //scroll-view 自定义下拉刷新
  async refresh() {
    console.log('开始刷新')
    this.setData({
      refreshBol: true
    })
    await app.initData();
    this.getGlobalData();
  },
  changeBlur(e) {
    this.data.globalData.blur = e.detail.value;
    wx.setStorageSync('blur', e.detail.value)
    this.syncCustom({
      blur: e.detail.value,
      hue: wx.getStorageSync('hue') ? wx.getStorageSync('hue') : 347
    })
  },
  changeBackground(e) {
    this.data.globalData.background = e.detail.value;
    wx.setStorageSync('background', e.detail.value)
    this.syncCustom({
      background_bol: e.detail.value,
      hue: wx.getStorageSync('hue') ? wx.getStorageSync('hue') : 347
    })
  },

  //获取用户数据
  async bindgetuserinfo(e) {
    if(wx.getStorageSync('openid')) {
      return;
    }
    this.setData({
      toastBol: true
    })
    app.globalData.initBol = false;
    const res = await app.onGetOpenid();
    wx.setStorageSync('openid', res.openid)
    if(res.status === 'ok') {
      
      let ifUser = await app.ifUser(res.openid);
      // console.log(ifUser)
      //获取值
      if(ifUser.res.status === 'ok') {
        console.log(ifUser.res.data)
        wx.setStorageSync('user', ifUser.res.data)
        await app.initData();
        this.getGlobalData();
      }
      //创建用户
      else if(ifUser.res.status === 'err') {
        let createUser = await app.createUser(res.openid,e.detail.userInfo)
        await app.initData();
        this.getGlobalData();
      }
    }
    else {
      console.log('错误')
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
    this.getGlobalData();
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