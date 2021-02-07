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
    toastBol: false,
    toastTitle: '',
    toastIcon: '',
    toastDuration: 99999,
    id: '',
    info: {},
    watchText: '关注',
    watchBol: false,
    ifWatch: false
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

  //跳转到他的日记
  toMyDiary() {
    wx.navigateTo({
      url: '/pages/userDiary/userDiary?id='+this.data.id+'&name='+this.data.info.userInfo.nickName,
    })
  },

  //跳转到他的收藏
  toMyCollection() {
    wx.navigateTo({
      url: '/pages/userCollection/userCollection?id='+this.data.id+'&name='+this.data.info.userInfo.nickName,
    })
  },

  //跳转到他的关注
  toMyWatch() {
    wx.navigateTo({
      url: '/pages/userWatch/userWatch?id='+this.data.id+'&name='+this.data.info.userInfo.nickName,
    })
  },

  //跳转到他的粉丝
  toMyFans() {
    wx.navigateTo({
      url: '/pages/userFans/userFans?id='+this.data.id+'&name='+this.data.info.userInfo.nickName,
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

  //判断是否关注
  async ifWatch() {
    let res = await wx.cloud.callFunction({
      name: 'ifWatch',
      data: {
        openid: wx.getStorageSync('openid'),
        userOpenid: this.data.id
      }
    })
    if(res.result.data.length <= 0) {
      this.setData({
        ifWatch: false,
        watchText: '关注'
      })
    }
    else {
      this.setData({
        ifWatch: true,
        watchText: '已关注'
      })
    }
    console.log(res)
  },

  //关注 || 取消关注
  async watchUser() {
    //关注
    if(wx.getStorageSync('openid') === this.data.id) {
      this.setData({
        toastBol: true,
        toastTitle: '不能关注自己',
        toastIcon: '',
        toastDuration: 1500,
      })
      return false;
    }

    if(this.data.ifWatch === false) {
      this.setData({
        watchBol: true,
        watchText: '关注中'
      })

      let res = await wx.cloud.callFunction({
        name: 'watchUser',
        data: {
          openid: wx.getStorageSync('openid'),
          userOpenid: this.data.id
        }
      })
      if(res.result.errMsg === "collection.update:ok") {
        this.setData({
          watchBol: false,
          watchText: '已关注',
          ifWatch: true
        })
        this.getUserInfo();
      }
      else {
        this.setData({
          watchBol: false,
          watchText: '关注',
          ifWatch: false
        })
      }
      console.log(res)
    }

    //取消关注
    else if(this.data.ifWatch === true) {
      this.setData({
        watchBol: true,
        watchText: '取消关注中'
      })

      let res = await wx.cloud.callFunction({
        name: 'unwatchFans',
        data: {
          openid: wx.getStorageSync('openid'),
          userOpenid: this.data.id
        }
      })
      console.log(res)
      if(res.result.errMsg === "collection.update:ok") {
        this.setData({
          watchBol: false,
          watchText: '关注',
          ifWatch: false
        })
        this.getUserInfo();
      }
      else {
        this.setData({
          watchBol: false,
          watchText: '已关注',
          ifWatch: true
        })
      }

    }
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
      // id: 'oRp3y0MvsGx3TW5zPRYg4iUcTTpI'
    })
    this.firstHeader();
    this.getUserInfo();
    this.ifWatch();
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