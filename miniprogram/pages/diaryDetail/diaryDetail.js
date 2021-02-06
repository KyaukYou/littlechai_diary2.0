// pages/diaryDetail/diaryDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    globalData: {},
    back: true,
    loadingBol: true,
    loadingIcon: '',
    loadingTitle: '',
    loadingDuration: 99999,
    refreshBol: false,
    id: '',
    info: {},
    diaryArr: [],
    like: [],
    collection: [],
    paixu: true,
    chatData: '',
    chatBol: true,
    pText: '留下你的评论呀~',
    chatsBol: false,
    chatsIndex: 0,
    chatsName: '',
    chatsOpenid: '',
    loginBol: false,
    loginTitle: '',
    loginDuration: 0,
    loginIcon: '',
    commentArr: [],
    commentNum: 0,
    commentBol: false
  },
  async refresh() {
    this.setData({
      refreshBol: true
    })
    this.init();
    
  },

  showBgImg() {
    wx.previewImage({
      urls: [this.data.info.title_image.url],
      current: this.data.info.title_image.url
    })
  },
  showImg(e) {
    let index1 = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.smindex;
    // console.log(e.currentTarget.dataset)
    let arr = [];
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    for(let i=0; i<copy[index1].imagesArr.length; i++) {
      arr.push(copy[index1].imagesArr[i].url)
    }
    console.log(arr,index2)
    wx.previewImage({
      urls: arr,
      current: arr[index2]
    })
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

  async getDiaryDetail() {
    let res = await wx.cloud.callFunction({
      name: 'getDiaryDetail',
      data: {
        id: this.data.id
      }
    })

    if(res.result.errMsg === "collection.get:ok") {

      let arr = JSON.parse(JSON.stringify(res.result.data[0]));
      if(this.data.like.includes(arr._id)) {
        arr.inLike = true;
      }
      else {
        arr.inLike = false;
      }
      if(this.data.collection.includes(arr._id)) {
        arr.inCollection = true;
      }
      else {
        arr.inCollection = false;
      }

      this.setData({
        info: arr,
        diaryArr: arr.diaryArr,
        paixu: arr.sort,
        loadingBol: false
      })
    }

  },

    //点赞
    async setLike(e) {
      if(wx.getStorageSync('openid')) {
        let that = this;
        let copy = JSON.parse(JSON.stringify(this.data.info));
  
        //判断是否已经点赞
        if(copy.inLike === false) {
          //还未点赞
          let copyLike = JSON.parse(JSON.stringify(this.data.like));
          copyLike.push(copy._id)
  
          //日记like+1
          copy.inLike = true;
          copy.like++;
          
          let res1 = await wx.cloud.callFunction({
            name: 'setDiaryLike',
            data: {
              id: copy._id,
              num: 1
            }
          })  
  
          if(res1.result.stats.updated === 1) {
            this.setData({
              info: copy,
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
        else if(copy.inLike === true) {
          //已经点赞
          let spliceIndex = null;
          let copyLike = JSON.parse(JSON.stringify(this.data.like));
          for(let i=0; i<this.data.like.length; i++) {
            if(this.data.like[i] === copy._id) {
              spliceIndex = i;
            }
          }
          if(spliceIndex != null) {
            copyLike.splice(spliceIndex,1)
          }
  
          //日记like-1
          copy.inLike = false;
          copy.like--;
          
          let res1 = await wx.cloud.callFunction({
            name: 'setDiaryLike',
            data: {
              id: copy._id,
              num: -1
            }
          })  
  
          if(res1.result.stats.updated === 1) {
            this.setData({
              info: copy,
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
  
    //收藏
    async setCollection(e) {
      if(wx.getStorageSync('openid')) {
        let that = this;
        let copy = JSON.parse(JSON.stringify(this.data.info));

        //判断是否已经点赞
        if(copy.inCollection === false) {
          //还未点赞
          let copyCollection = JSON.parse(JSON.stringify(this.data.collection));
          copyCollection.push(copy._id)
  
          //日记like+1
          copy.inCollection = true;
          copy.collection++;
          
          let res1 = await wx.cloud.callFunction({
            name: 'setDiaryCollection',
            data: {
              id: copy._id,
              num: 1
            }
          })  
  
          if(res1.result.stats.updated === 1) {
            this.setData({
              info: copy,
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
        else if(copy.inCollection === true) {
          //已经点赞
          let spliceIndex = null;
          let copyCollection = JSON.parse(JSON.stringify(this.data.collection));
          for(let i=0; i<this.data.collection.length; i++) {
            if(this.data.collection[i] === copy._id) {
              spliceIndex = i;
            }
          }
          if(spliceIndex != null) {
            copyCollection.splice(spliceIndex,1)
          }
  
          //日记like-1
          copy.inCollection = false;
          copy.collection--;
          
          let res1 = await wx.cloud.callFunction({
            name: 'setDiaryCollection',
            data: {
              id: copy._id,
              num: -1
            }
          })  
  
          if(res1.result.stats.updated === 1) {
            this.setData({
              info: copy,
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


  // 评论事件
  // 评论头像点击
  toUsers(e) {
    wx.navigateTo({
      url: '../userInfo/userInfo?id=' + e.currentTarget.dataset.openid,
    })
  },
  // 评论内容
  getChat(e) {
    this.setData({
      chatData: e.detail.value
    })
  },
  //回复评论
  async uploadChat() {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      this.setData({
        loginBol: true,
        loginTitle: '请先登录',
        loginDuration: 1500
      })
      return;
    }

    if (this.data.chatData == '') {
      this.setData({
        loginBol: true,
        loginTitle: '请输入内容',
        loginDuration: 2000
      })
    } 
    else {
      this.setData({
        loginBol: true,
        loginIcon: 'loading',
        loginTitle: '评论中',
        loginDuration: 99999
      })
  
      //楼中楼
      if(this.data.chatsBol) {  
        let time = await app.timeStampX(new Date().getTime());

        let res = await wx.cloud.callFunction({
          name: 'uploadComment',
          data: {
            diary_id: this.data.id,
            updatedTime: time,
            openid: wx.getStorageSync('openid'),
            comment_openid: this.data.chatsOpenid,
            comment_index: this.data.chatsIndex,
            bol: true,
            content: this.data.chatData
          }
        })
        console.log(res)
        if(res.result.errMsg === "collection.update:ok") {
          this.setData({
            loginBol: true,
            loginIcon: 'success',
            loginTitle: '评论成功',
            loginDuration: 1500,
            chatData: '',
            chatsName: '',
            chatsOpenid: '',
            pText: '留下你的评论呀~',
            chatsBol: false
          })

          this.getComment();
        }

      }
      //正常评论
      else {
        let time = await app.timeStampX(new Date().getTime());

        let res = await wx.cloud.callFunction({
          name: 'uploadComment',
          data: {
            diary_id: this.data.id,
            updatedTime: time,
            createdTime: time,
            openid: wx.getStorageSync('openid'),
            bol: false,
            content: this.data.chatData
          }
        })

        if(res.result.errMsg === "collection.update:ok") {
          this.setData({
            loginBol: true,
            loginIcon: 'success',
            loginTitle: '评论成功',
            loginDuration: 1500,
            chatData: ""
          })

          this.getComment();
        }
         
      }
    }

  },

  //获得评论内容
  async getComment() {
    console.log(this.data.id)
    let res = await wx.cloud.callFunction({
      name: 'getComment',
      data: {
        diary_id: this.data.id
      }
    })
    console.log(res)
    let num = 0;
    for(let i=0; i<res.result.length; i++) {
      num++;
      for(let j=0; j<res.result[i].arr.length; j++) {
        num++
      }
    }
    this.setData({
      commentArr: res.result,
      commentNum: num
    })
  },

  //楼中楼
  chattochat(e) {
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;
    this.setData({
      chatsIndex: index,
      chatsName: name,
      chatData: '',
      pText: '回复：'+ name,
      chatsBol: true,
      chatsOpenid: e.currentTarget.dataset.openid
    })
  },

  //取消楼中楼
  cancelChats() {
    this.setData({
      chatData: '',
      chatsName: '',
      chatsOpenid: '',
      pText: '留下你的评论呀~',
      chatsBol: false
    })
  },

  //获得评论权限
  async getCommentBol() {
    let res = await wx.cloud.callFunction({
      name: 'getCommentBol'
    })
    console.log(res)
    if(res.result.errMsg === "collection.get:ok") {
      this.setData({
        commentBol: res.result.data[0].controlChat,
        refreshBol: false
      })

      if(res.result.data[0].controlChat === true) {
        this.getComment();
      }
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })  
    this.setData({
      loadingBol: true,
      loadingIcon: 'loading',
      loadingTitle: '加载中',
      loadingDuration: 99999
    })
    this.getGlobalData();
    this.init();
  },

  async init() {
    await this.getUserArr();
    await this.getDiaryDetail();
    await this.getCommentBol();
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