// pages/myQuestion/myQuestion.js
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
    questionArr: [
      
    ],
    refreshBol: false,
    bottomLoading: false

  },
  refresh() {
    this.setData({
      refreshBol: true
    })
    this.getQuestion();
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
  //添加问题
  toAddQuestion() {
    wx.navigateTo({
      url: '/pages/uploadQuestion/uploadQuestion',
    })
  },
  //查看问题详情
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/myQuestionDetail/myQuestionDetail?id='+e.currentTarget.dataset.id,
    })
  },
  //获取问题数据
  async getQuestion() {
    let arr = []
    let res = await wx.cloud.callFunction({
      name: 'getMyQuestion',
      data: {
        openid: wx.getStorageSync('openid'),
      }
    })
    arr = res.result.data;
    this.setData({
      questionArr: arr,
      loadingBol: false,
      loadingIcon: 'success',
      loadingTitle: '加载成功',
      loadingDuration: 0,
      refreshBol: false
    })
  },
  deleteQuestion(e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.showModal({
      title: '是否删除',
      content: '删除后将无法恢复',
      success(val) {

        if(val.confirm === true) {
          that.setData({
            loadingBol: true,
            loadingIcon: 'loading',
            loadingTitle: '删除中',
            loadingDuration: 99999,
          })
          wx.cloud.callFunction({
            name: 'deleteQuestion',
            data: {
              id: id,
            },
            success(res) {
              if (res.result.stats.updated === 1) {
                that.setData({
                  loadingBol: true,
                  loadingIcon: 'success',
                  loadingTitle: '删除成功',
                  loadingDuration: 1200,
                  page: 1
                })
                that.getQuestion('new')
              }
            }
          })
        }
      }   
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name: 'setUserAnswer',
      data: {
        openid: wx.getStorageSync('openid')
      }
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
    this.getQuestion()
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