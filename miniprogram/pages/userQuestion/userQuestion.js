// pages/userQuestion/userQuestion.js
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
    page: 1,
    per_page: 12,
    noQuestion: false

  },
  async refresh() {
    this.setData({
      refreshBol: true,
      page: 1
    })
    await this.getQuestionX();
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
  //查看问题详情
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/userQuestionDetail/userQuestionDetail?id='+e.currentTarget.dataset.id,
    })
  },
  //获取问题数据
  async getQuestion(type) {
    let copy = JSON.parse(JSON.stringify(this.data.questionArr));
    let res = await wx.cloud.callFunction({
      name: 'getUserQuestion',
      data: {
        page: this.data.page,
        per_page: this.data.per_page
      }
    })
    let arr = res.result.data;

    if(type === 'new') {
      copy = [];
    }

    for(let j=0; j<arr.length; j++) {
      copy.push(arr[j])
    }

    this.setData({
      questionArr: copy,
      loadingBol: false,
      loadingIcon: 'success',
      loadingTitle: '加载成功',
      loadingDuration: 0,
      refreshBol: false
    })
  },
  async getQuestionX() {
    let copy = [];
    let res = await wx.cloud.callFunction({
      name: 'getUserQuestion',
      data: {
        page: this.data.page,
        per_page: this.data.per_page
      }
    })
    let arr = res.result.data;
    for(let i=0; i<arr.length; i++) {
      copy.push(arr[i])
    }
    this.setData({
      questionArr: copy,
      loadingBol: false,
      loadingIcon: 'success',
      loadingTitle: '加载成功',
      loadingDuration: 0,
      refreshBol: false,
    })
  },
  async scrollToBottom() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page
    })
    let res = await wx.cloud.callFunction({
      name: 'getUserQuestion',
      data: {
        page: this.data.page,
        per_page: this.data.per_page
      }
    })
    let arr = res.result.data;
    let copy = JSON.parse(JSON.stringify(this.data.questionArr));
    for(let i=0; i<arr.length; i++) {
      copy.push(arr[i])
    }
    this.setData({
      questionArr: copy
    })
    if(arr.length < 6) {
      this.setData({
        noQuestion: true
      })
    }
  },
  //删除
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
              console.log(res)
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



  //解除删除
  cancelQuestion(e) {
    let id = e.currentTarget.dataset.id;
    let that = this;
    wx.showModal({
      title: '是否恢复',
      content: '此操作将恢复问题',
      success(val) {

        if(val.confirm === true) {
          that.setData({
            loadingBol: true,
            loadingIcon: 'loading',
            loadingTitle: '恢复中',
            loadingDuration: 1500,
          })
          wx.cloud.callFunction({
            name: 'cancelQuestion',
            data: {
              id: id,
            },
            success(res) {
              console.log(res)
              if (res.result.stats.updated === 1) {
                that.setData({
                  loadingBol: true,
                  loadingIcon: 'success',
                  loadingTitle: '恢复成功',
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
      loadingDuration: 99999,
      page: 1
    })
    this.getQuestion('new')
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