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
    loadingBol: false,
    beginBol: false,
    page: 1,
    per_page: 12,
    bottomBol: false,
    tabCurrent: 'tab_one',
    searchValue: "",
    searchBol: false
  },
  changeTabs(e) {
    // console.log(e.detail.activeKey)
    this.setData({
      tabCurrent: e.detail.activeKey,
      beginBol: true,
      page: 1
    })
    this.init();
  },

  //获取输入内容
  changeSearchValue(e) {
    if (e.detail.value == "") {
      this.setData({
        searchValue: e.detail.value,
        searchBol: false
      })
    } else {
      this.setData({
        searchValue: e.detail.value,
        searchBol: true
      })
    }
  },

  //清空输入内容
  clearSearchValue() {
    this.setData({
      searchValue: "",
      searchBol: false
    })
  },

  clickSearchFn() {
    this.setData({
      beginBol: true,
      page: 1
    })
    this.init();
  },

  async getGlobalData() {
    let timer = setInterval(() => {
      if (app.globalData.initBol === true) {
        this.setData({
          globalData: app.globalData,
          refreshBol: false
        })
        clearInterval(timer);
      }
    }, 100)
  },

  async getUsers() {
    let res = await wx.cloud.callFunction({
      name: 'almightyApi',
      data: {
        type: 'getUsers',
        keyWords: this.data.searchValue,
        sort: this.data.tabCurrent,
        page: this.data.page,
        per_page: this.data.per_page
      }
    })

    if (res.errMsg === "cloud.callFunction:ok") {
      let copy = [];
      let arr = JSON.parse(JSON.stringify(res.result.data));

      for (let i = 0; i < arr.length; i++) {
        copy.push(arr[i])
      }
      this.setData({
        info: copy,
        refreshBol: false,
        loadingBol: false,
        beginBol: false
      })
    }
    console.log(res)
  },

  async scrollToBottom() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page,
      loadingBol: true,
    })
    let res = await wx.cloud.callFunction({
      name: 'almightyApi',
      data: {
        type: 'getUsers',
        keyWords: this.data.searchValue,
        sort: this.data.tabCurrent,
        page: this.data.page,
        per_page: this.data.per_page
      }
    })

    if (res.errMsg === "cloud.callFunction:ok") {
      let copy = JSON.parse(JSON.stringify(this.data.info));
      let arr = JSON.parse(JSON.stringify(res.result.data));

      for (let i = 0; i < arr.length; i++) {
        copy.push(arr[i])
      }
      if (arr.length < 12) {
        this.setData({
          info: copy,
          refreshBol: false,
          loadingBol: false,
          bottomBol: true
        })
      } else {
        this.setData({
          info: copy,
          refreshBol: false,
          loadingBol: false
        })
      }

    }
    console.log(res)
  },

  toUsers(e) {
    wx.navigateTo({
      url: '../adminUserInfo/adminUserInfo?id=' + e.currentTarget.dataset.openid,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGlobalData();
    this.setData({
      // loadingBol: true,
      beginBol: true,
    })
    this.init();
  },

  async init() {
    await this.getUsers();
  },
  async refresh() {
    this.setData({
      refreshBol: true,
      page: 1,
      bottomBol: false
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