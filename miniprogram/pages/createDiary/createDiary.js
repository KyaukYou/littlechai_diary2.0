// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    toastTitle: "结束日期超出开始日期，为避免丢失日记信息，请重新选择日期时间段",
    toastDuration: 4500,
    toastBol: false,
    showBeginDate: false,
    showEndDate: false,
    minDate1: "",
    maxDate1: "",
    minDate2: new Date().getTime(),
    maxDate2: "",
    info: {
      title: "",
      title_image: "/images/wx.png",
      location: "",
      beginDate: "",
      endDate: "",
      lock: false,
      show: true,
      sort: true,
      createdTime: "",
      updatedTime: "",
    },
    diaryArr: [
      {
        date: "",
        show: true,
        content: "",
        imagesArr: [
          {
            type: "new",
            httpUrl: "",
            fileUrl: ""
          }
        ]
      }
    ]
  },
  // 初始化自定义导航栏
  async firstHeader() {
    this.setData({
      globalData: app.globalData
    })
  },
  getThisTime() {
    // let timer = new Date().getTime()
    // this.setData({
    //   maxDate1: timer
    // })
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
  // 输入标题
  changeTitle(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.title = e.detail.value;
    this.setData({
      info: copy
    })
  },
  //输入位置
  changeLocation(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.location = e.detail.value;
    this.setData({
      info: copy
    })
  },
  // 选择位置
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        let copy = JSON.parse(JSON.stringify(this.data.info))
        copy.location = res.name + '(' + res.address + ')'
        this.setData({
          info: copy
        })
      },
      fail: (res)=> {
        
      }
    })
  },
  // 显示开始日期框
  showBeginDateBol() {
    this.setData({
      showBeginDate: true
    })
  },

  // 显示结束日期框
  showEndDateBol() {
    this.setData({
      showEndDate: true
    })
  },

  //选择开始日期
  async selectBeginDate(e) {
    console.log(e)
    let copy = JSON.parse(JSON.stringify(this.data.info))
    let trueDate = await app.timeStamp(e.detail)
    copy.beginDate = trueDate;

    let y = trueDate.split('-')[0];
    let m = trueDate.split('-')[1];
    let d = trueDate.split('-')[2];
    console.log(y,m,d)

    let endDate = 0
    let beginDate = new Date(trueDate).getTime();
    if(this.data.info.endDate != "") {
      endDate = new Date(this.data.info.endDate).getTime();
    }
    console.log(endDate)
    if(endDate < beginDate && endDate !== 0) {
      // 提示
      this.setData({
        toastBol: true
      })
    }
    this.setData({
      info: copy,
      minDate2: new Date(parseInt(y), parseInt(m)-1, parseInt(d)).getTime()
    })

  },
  //选择结束日期
  async selectEndDate(e) {
    console.log(e)
    let copy = JSON.parse(JSON.stringify(this.data.info))
    let trueDate = await app.timeStamp(e.detail)
    copy.endDate = trueDate;
    this.setData({
      info: copy
    })
  },

  // 锁定解锁
  lockFn(e) {
    console.log(e)
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.lock = e.detail.value;
    this.setData({
      info: copy
    })
  },

  // 显示隐藏
  showFn(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.show = e.detail.value;
    this.setData({
      info: copy
    })
  },
  // 排序
  sortFn(e) {
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.sort = e.detail.value;
    this.setData({
      info: copy
    })
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
    this.firstHeader();
    this.getThisTime();
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