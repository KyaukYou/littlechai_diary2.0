// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    back: true,
    refreshBol: false,
    id: '',
    name: '',
    info: [],
    openidArr: [],
    toastBol: false,
    toastTitle: '',
    toastIcon: '',
    toastDuration: 99999,
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

  async getFollowing() {
    let res = await wx.cloud.callFunction({
      name: 'almightyApi',
      data: {
        type: 'getFans',
        openid: this.data.id
      }
    })

    if(res.errMsg === "cloud.callFunction:ok") {

      for(let i=0; i<res.result.length; i++) {
        if(this.data.openidArr.includes(res.result[i].openid)) {
          res.result[i].watchText = '已关注'
          res.result[i].watchBol = true
          res.result[i].watchloading = false
        }
        else {
          res.result[i].watchText = '关注'
          res.result[i].watchBol = false
          res.result[i].watchloading = false
        }
      }

      this.setData({
        info: res.result,
        loadingBol: false,
        refreshBol: false
      })
    }
    console.log(res)
  },

  //判断是否关注
  async ifWatch() {
    let res = await wx.cloud.callFunction({
      name: 'almightyApi',
      data: {
        type: 'getMyFollow',
        openid: wx.getStorageSync('openid')
      }
    })

    if(res.errMsg === "cloud.callFunction:ok") {

      let arr = [];
      for(let i=0; i<res.result.length; i++) {
        arr.push(res.result[i].openid)
      }
      this.setData({
        openidArr: arr
      })
    }
    console.log(res)
  },

  toUsers(e) {
    wx.navigateTo({
      url: '../userInfo/userInfo?id=' + e.currentTarget.dataset.openid,
    })
  },


  //关注 || 取消关注
  async watchUser(e) {
    let index = e.currentTarget.dataset.index;
    let copy = JSON.parse(JSON.stringify(this.data.info))
    //关注
    // console.log(wx.getStorageSync('openid'),this.data.info[index].openid)
    if(wx.getStorageSync('openid') === this.data.info[index].openid) {
      
      this.setData({
        toastBol: true,
        toastTitle: '不能关注自己',
        toastIcon: '',
        toastDuration: 1500,
      })
      return false;
    }

    if(this.data.info[index].watchBol === false) {
      copy[index].watchloading = true;
      copy[index].watchText = '关注中';
      this.setData({
        info: copy
      })

      let res = await wx.cloud.callFunction({
        name: 'watchUser',
        data: {
          openid: wx.getStorageSync('openid'),
          userOpenid: copy[index].openid
        }
      })
      if(res.result.errMsg === "collection.update:ok") {
        copy[index].watchloading = false;
        copy[index].watchText = '已关注';
        copy[index].watchBol = true;
        this.setData({
          arr: copy
        })
        this.init();
      }
      else {
        copy[index].watchloading = false;
        copy[index].watchText = '关注';
        copy[index].watchBol = false;
        this.setData({
          arr: copy
        })
      }
      console.log(res)
    }

    //取消关注
    else if(this.data.info[index].watchBol === true) {
      copy[index].watchloading = true;
      copy[index].watchText = '取消关注中';
      this.setData({
        info: copy
      })

      let res = await wx.cloud.callFunction({
        name: 'unwatchFans',
        data: {
          openid: wx.getStorageSync('openid'),
          userOpenid: copy[index].openid
        }
      })
      if(res.result.errMsg === "collection.update:ok") {
        copy[index].watchloading = false;
        copy[index].watchText = '关注';
        copy[index].watchBol = false;
        this.setData({
          arr: copy
        })
        this.init();
      }
      else {
        copy[index].watchloading = false;
        copy[index].watchText = '已关注';
        copy[index].watchBol = true;
        this.setData({
          arr: copy
        })
      }
      console.log(res)
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGlobalData();
    this.setData({
      id: options.id,
      name: options.name,
      // id: 'oRp3y0MvsGx3TW5zPRYg4iUcTTpI'

      loadingBol: true,
    })
    this.init();
  },

  async init() {
    await this.ifWatch();
    await this.getFollowing();
  },
  async refresh() {
    this.setData({
      refreshBol: true,
    })
    await this.init();
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