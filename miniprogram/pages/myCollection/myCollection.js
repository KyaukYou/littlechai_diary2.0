// pages/myCollection/myCollection.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refreshBol: false,
    back: true,
    globalData: {},
    pos: {
      right: "8%",
      bottom: "5.4%"
    },
    screenHeight: 0, 
    screenWidth: 0, 
    toastBol: false,
    toastTitle: "",
    toastDuration: 0,
    diaryArr: [],
    page: 1,
    per_page: 5,
    openid: "",
    like: [],
    collection: [],
    noDiary: false,
    loadingBol: false,
    loadingIcon: '',
    loadingTitle: '',
    loadingDuration: 99999,
    searchValue: "",
    searchBol: false,
    tabCurrent: 'tab_one',
    bottomLoading: false
  },
  //获取输入内容
  changeSearchValue(e) {
    if(e.detail.value == "") {
      this.setData({
        searchValue: e.detail.value,
        searchBol: false
      })
    }
    else {
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
      loadingBol: true,
      loadingIcon: 'loading',
      loadingTitle: '加载中',
      loadingDuration: 99999,
      noDiary: false
    })
    this.searchFn();
  },
  //搜索
  async searchFn() {
    //有值
    if(this.data.searchBol === true) {
      if(this.data.tabCurrent == 'tab_one') {
        this.getDiary_value(this.data.searchValue,'updatedTimeA','new')
      }
      else if(this.data.tabCurrent == 'tab_two') {
        this.getDiary_value(this.data.searchValue,'updatedTimeB','new')
      }
      else if(this.data.tabCurrent == 'tab_three') {
        this.getDiary_value(this.data.searchValue,'like','new')
      }
      else if(this.data.tabCurrent == 'tab_four') {
        this.getDiary_value(this.data.searchValue,'see','new')
      }
    }
    //没值
    else if(this.data.searchBol === false) {
      if(this.data.tabCurrent == 'tab_one') {
        this.getDiary_noValue('updatedTimeA','new')
      }
      else if(this.data.tabCurrent == 'tab_two') {
        this.getDiary_noValue('updatedTimeB','new')
      }
      else if(this.data.tabCurrent == 'tab_three') {
        this.getDiary_noValue('like','new')
      }
      else if(this.data.tabCurrent == 'tab_four') {
        this.getDiary_noValue('see','new')
      }
    }
  },
  
  async searchFnX() {
    //有值
    if(this.data.searchBol === true) {
      if(this.data.tabCurrent == 'tab_one') {
        this.getDiary_valueX(this.data.searchValue,'updatedTimeA','new')
      }
      else if(this.data.tabCurrent == 'tab_two') {
        this.getDiary_valueX(this.data.searchValue,'updatedTimeB','new')
      }
      else if(this.data.tabCurrent == 'tab_three') {
        this.getDiary_valueX(this.data.searchValue,'like','new')
      }
      else if(this.data.tabCurrent == 'tab_four') {
        this.getDiary_valueX(this.data.searchValue,'see','new')
      }
    }
    //没值
    else if(this.data.searchBol === false) {
      if(this.data.tabCurrent == 'tab_one') {
        this.getDiary_noValueX('updatedTimeA','new')
      }
      else if(this.data.tabCurrent == 'tab_two') {
        this.getDiary_noValueX('updatedTimeB','new')
      }
      else if(this.data.tabCurrent == 'tab_three') {
        this.getDiary_noValueX('like','new')
      }
      else if(this.data.tabCurrent == 'tab_four') {
        this.getDiary_noValueX('see','new')
      }
    }
  },

  async getDiary_value(value,sort,type) {
    this.setData({
      page: 1
    })
    let res = await wx.cloud.callFunction({
      name: 'getMyCollection',
      data: {
        page: this.data.page,
        per_page: this.data.per_page,
        value: value,
        sort: sort,
        openid: wx.getStorageSync('openid')
      }
    })

    let arr = res.result;
    let copy = [];
    for(let j=0; j<arr.length; j++) {
      if(this.data.like.includes(arr[j]._id)) {
        arr[j].inLike = true;
      }
      else {
        arr[j].inLike = false;
      }
      if(this.data.collection.includes(arr[j]._id)) {
        arr[j].inCollection = true;
      }
      else {
        arr[j].inCollection = false;
      }
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: copy,
      loadingBol: false,
    })
    
  },
  async getDiary_noValue(sort,type) {
    this.setData({
      page: 1
    })
    let res = await wx.cloud.callFunction({
      name: 'getMyCollection',
      data: {
        page: this.data.page,
        per_page: this.data.per_page,
        sort: sort,
        openid: wx.getStorageSync('openid'),
        value: ''
      }
    })

    let arr = res.result;
    let copy = [];
    for(let j=0; j<arr.length; j++) {
      if(this.data.like.includes(arr[j]._id)) {
        arr[j].inLike = true;
      }
      else {
        arr[j].inLike = false;
      }
      if(this.data.collection.includes(arr[j]._id)) {
        arr[j].inCollection = true;
      }
      else {
        arr[j].inCollection = false;
      }
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: copy,
      loadingBol: false
    })
  },

  async getDiary_valueX(value,sort,type) {
    let res = await wx.cloud.callFunction({
      name: 'getMyCollection',
      data: {
        page: this.data.page,
        per_page: this.data.per_page,
        value: value,
        sort: sort,
        openid: wx.getStorageSync('openid')
      }
    })

    let arr = res.result;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    for(let j=0; j<arr.length; j++) {
      if(this.data.like.includes(arr[j]._id)) {
        arr[j].inLike = true;
      }
      else {
        arr[j].inLike = false;
      }
      if(this.data.collection.includes(arr[j]._id)) {
        arr[j].inCollection = true;
      }
      else {
        arr[j].inCollection = false;
      }
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: copy,
      loadingBol: false,
      bottomLoading: false
    })
    if(arr.length < 6) {
      this.setData({
        noDiary: true
      })
    }
    
  },
  async getDiary_noValueX(sort,type) {
    let res = await wx.cloud.callFunction({
      name: 'getMyCollection',
      data: {
        page: this.data.page,
        per_page: this.data.per_page,
        sort: sort,
        openid: wx.getStorageSync('openid'),
        value: ''
      }
    })

    let arr = res.result;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    for(let j=0; j<arr.length; j++) {
      if(this.data.like.includes(arr[j]._id)) {
        arr[j].inLike = true;
      }
      else {
        arr[j].inLike = false;
      }
      if(this.data.collection.includes(arr[j]._id)) {
        arr[j].inCollection = true;
      }
      else {
        arr[j].inCollection = false;
      }
      copy.push(arr[j])
    }
    this.setData({
      diaryArr: copy,
      loadingBol: false,
      bottomLoading: false
    })
    if(arr.length < 6) {
      this.setData({
        noDiary: true
      })
    }
  },

  async getUserArr() {
    if(wx.getStorageSync('openid') && wx.getStorageSync('user')) {
      let res = await wx.cloud.callFunction({
        name: 'getUserArr',
        data: {
          openid: wx.getStorageSync('openid')
        }
      })
      console.log(res)
      this.setData({
        like: res.result.data[0].like,
        collection: res.result.data[0].collection
      })
    }
  },
  // 初始化自定义导航栏
  async firstHeader() {
    this.setData({
      globalData: app.globalData
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
  // 选项切换
  changeTabs(e) {
    console.log(e.detail.activeKey)
    this.setData({
      tabCurrent: e.detail.activeKey
    })

    this.clickSearchFn();

  },
  //scroll-view 自定义下拉刷新
  async refresh() {
    await this.getUserArr();
    this.setData({
      page: 1,
      per_page: 6,
      noDiary: false
    })
    await this.searchFn();
    if(!wx.getStorageSync('openid')) {
      this.setData({
        refreshBol: false
      })
      return false;
    }
    this.setData({
      refreshBol: true
    })
    await app.initData();
    this.getGlobalData();
  },


  // 滚动到底部
   async scrollToBottom() {
    let page = this.data.page;
    page++;
    this.setData({
      page: page,
      noDiary: false,
      bottomLoading: true
    })

    this.searchFnX();

   },

   toUsers(e) {
    wx.navigateTo({
      url: '../userInfo/userInfo?id=' + e.currentTarget.dataset.openid,
    })
  },

  //  锁定解锁
  async lockDiary(e) {
    let that = this;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    let index = e.currentTarget.dataset.index;
    let openid = e.currentTarget.dataset.openid;
    if(openid === wx.getStorageSync('openid')) {
      wx.showModal({
        title: copy[index].lock === true ? '是否解锁' : '是否锁定',
        content: copy[index].lock === true ? '解锁后他人将能查看你的日记' : '锁定后他人将不能查看你的日记',
        success(val) {
          console.log(val)
          if(val.confirm === true) {
            wx.cloud.callFunction({
              name: 'lockDiary',
              data: {
                id: copy[index]._id,
                lock: !copy[index].lock
              },
              success(res) {
                if (res.result.stats.updated === 1) {
                  copy[index].lock = !copy[index].lock;
                  that.setData({
                    diaryArr: copy
                  })
                }
              }
            })
          }
        }   
      })
    }
    else {
      console.log('不是本人')
    }
  },
  toEditDiary(e) {
    let id = e.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: '/pages/diaryDetail/diaryDetail?id='+id,
    })
    
  },

  //点赞
  async setLike(e) {

    if(wx.getStorageSync('openid')) {
      let that = this;
      let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
      let index = e.currentTarget.dataset.index;
      let openid = e.currentTarget.dataset.openid;

      //判断是否已经点赞
      if(copy[index].inLike === false) {
        //还未点赞
        let copyLike = JSON.parse(JSON.stringify(this.data.like));
        copyLike.push(copy[index]._id)

        //日记like+1
        copy[index].inLike = true;
        copy[index].like++;
     
        let res1 = await wx.cloud.callFunction({
          name: 'setDiaryLike',
          data: {
            id: copy[index]._id,
            num: 1
          }
        })  

        if(res1.result.stats.updated === 1) {
          this.setData({
            diaryArr: copy,
            like: copyLike
          }) 
          let res2 = await wx.cloud.callFunction({
            name: 'setUserLikeNum',
            data: {
              openid: wx.getStorageSync('openid'),
              num: 1,
              like: copyLike
            }
          })

        }

      
      }
      else if(copy[index].inLike === true) {
        //已经点赞
        let spliceIndex = null;
        let copyLike = JSON.parse(JSON.stringify(this.data.like));
        for(let i=0; i<this.data.like.length; i++) {
          if(this.data.like[i] === copy[index]._id) {
            spliceIndex = i;
          }
        }
        if(spliceIndex != null) {
          copyLike.splice(spliceIndex,1)
        }

        //日记like-1
        copy[index].inLike = false;
        copy[index].like--;
        
        let res1 = await wx.cloud.callFunction({
          name: 'setDiaryLike',
          data: {
            id: copy[index]._id,
            num: -1
          }
        })  

        if(res1.result.stats.updated === 1) {
          this.setData({
            diaryArr: copy,
            like: copyLike
          })  
          let res2 = await wx.cloud.callFunction({
            name: 'setUserLikeNum',
            data: {
              openid: wx.getStorageSync('openid'),
              num: -1,
              like: copyLike
            }
          })
        }
        
      }

    }
    else {
      this.setData({
        toastBol: true,
        toastTitle: "请先登录",
        toastDuration: 2000
      })
    }
  },

  async setCollection(e) {
    if(wx.getStorageSync('openid')) {
      let that = this;
      let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
      let index = e.currentTarget.dataset.index;
      let openid = e.currentTarget.dataset.openid;

      //判断是否已经点赞
      if(copy[index].inCollection === false) {
        //还未点赞
        let copyCollection = JSON.parse(JSON.stringify(this.data.collection));
        copyCollection.push(copy[index]._id)

        //日记like+1
        copy[index].inCollection = true;
        copy[index].collection++;
  
        let res1 = await wx.cloud.callFunction({
          name: 'setDiaryCollection',
          data: {
            id: copy[index]._id,
            num: 1
          }
        })  

        if(res1.result.stats.updated === 1) {
          this.setData({
            diaryArr: copy,
            collection: copyCollection
          })  
          let res2 = await wx.cloud.callFunction({
            name: 'setUserCollectionNum',
            data: {
              openid: wx.getStorageSync('openid'),
              num: 1,
              collection: copyCollection
            }
          })

        }

      
      }
      else if(copy[index].inCollection === true) {
        //已经点赞
        let spliceIndex = null;
        let copyCollection = JSON.parse(JSON.stringify(this.data.collection));
        for(let i=0; i<this.data.collection.length; i++) {
          if(this.data.collection[i] === copy[index]._id) {
            spliceIndex = i;
          }
        }
        if(spliceIndex != null) {
          copyCollection.splice(spliceIndex,1)
        }

        //日记like-1
        copy[index].inCollection = false;
        copy[index].collection--;
        let res1 = await wx.cloud.callFunction({
          name: 'setDiaryCollection',
          data: {
            id: copy[index]._id,
            num: -1
          }
        })  

        if(res1.result.stats.updated === 1) {
          this.setData({
            diaryArr: copy,
            collection: copyCollection
          })  
          let res2 = await wx.cloud.callFunction({
            name: 'setUserCollectionNum',
            data: {
              openid: wx.getStorageSync('openid'),
              num: -1,
              collection: copyCollection
            }
          })
          copy.splice(index,1)
          this.setData({
            diaryArr: copy
          })
        }
        
      }
    }
    else {
      this.setData({
        toastBol: true,
        toastTitle: "请先登录",
        toastDuration: 2000
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.firstHeader();
    var that = this; 
    wx.getSystemInfo({ 
    success: function (res) { 
      that.setData({ 
      screenHeight: res.windowHeight, 
      screenWidth: res.windowWidth, 
      loadingBol: true,
      loadingIcon: 'loading',
      loadingTitle: '加载中',
      loadingDuration: 99999
      }); 
    } 
    }); 
    this.init();
  },

  async init() {
    this.setData({
      page: 1
    })
    await this.getUserArr();
    await this.getGlobalData();
    await this.searchFn();
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