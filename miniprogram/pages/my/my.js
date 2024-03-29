// pages/my/my.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: false,
    refreshBol: false,
    globalData: {},
    rgb: 'rgb(0,0,0)', //初始值
    pick: false,
    header_image: "",
    header_imageX: "",
    color: "",
    info: {},
    background_url: "",
    controlDiary_bol: true,
    controlChat_bol: true,
    toastBol: false,
    toastTitle: '登录中',
    toastBol1: false,
    toastTitle1: '上传中',
    toastDuration: 999999,
    ms_content: "",
    ms_show: "",
    maxlength: 80,
    version_text: "新版本介绍",
    version_num: "",
    toastBolX: false,
    toastTitleX: "",
    toastDurationX: 0,
    answer_text: "",
    userInfoBoolean: false,
    newUserInfo: {}
  },
  // 初始化自定义导航栏
  async firstHeader() {
    this.setData({
      globalData: app.globalData
    })
  },
  //输入一句话
  changeHeadline(e) {
    console.log(e)
    if (!wx.getStorageSync('openid')) {
      
    }
    else {
      let copy = JSON.parse(JSON.stringify(this.data.info));
      copy.headline = e.detail.value
      this.setData({
        info: copy
      })
    }
    
  },

  //存储一句话
  async saveHeadline() {
    if (!wx.getStorageSync('openid')) {
      
    }
    else {
      let res = await wx.cloud.callFunction({
        name: 'updateCustom',
        data: {
          openid: wx.getStorageSync('openid'),
          update: {
            "userInfo.headline": this.data.info.headline
          }
        }
      })
    }
    // console.log(res)
  },

  // 颜色等自定义同步云函数
  async syncCustom(val) {
    // console.log(val)
    if (wx.getStorageSync('openid')) {
      let res = await wx.cloud.callFunction({
        name: 'updateCustom',
        data: {
          update: val,
          openid: wx.getStorageSync('openid')
        }
      })
      console.log(res)
      if (res.result.stats.updated === 1) {
        // await app.initData();
        // this.getGlobalData();
      }
    } else {
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
    app.globalData.color = rgb;
    this.setData({
      globalData: app.globalData,
    })
    this.syncCustom({
      color: rgb,
      hue: wx.getStorageSync('hue') ? wx.getStorageSync('hue') : 347
    })
  },
  getGlobalData() {
    // let timer = setInterval(() => {
      let userInfoStorage = wx.getStorageSync('user')
      console.log(app.globalData,userInfoStorage)
      if (app.globalData.initBol === true) {
        // clearInterval(timer)
        this.setData({
          globalData: app.globalData,
          rgb: app.globalData.color,
          color: app.globalData.background === true ? "" : app.globalData.color
        })
        if (wx.getStorageSync('user')) {
          let res = wx.getStorageSync('user');
          this.setData({
            info: {
              diary_num: res.diary_num,
              collection_num: res.collection_num,
              following_num: res.following_num,
              fans: res.fans,
              headline: res.userInfo.headline,
              secret: res.secret,
              answer: res.answer,
              message: res.message
            },
            background_url: res.background_url
          })
        }

        if (app.globalData.roles[0] === 'admin') {
          this.getControlDiary();
        }

        this.setData({
          toastBol: false,
          refreshBol: false
        })

      }
      // console.log(app.globalData)
    // }, 100)
  },
  //scroll-view 自定义下拉刷新
  async refresh() {
    console.log('开始刷新')
    this.getVersion_one();
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
  changeBlur(e) {
    this.data.globalData.blur = e.detail.value;
    wx.setStorageSync('blur', e.detail.value)
    app.globalData.blur = e.detail.value;
    this.setData({
      globalData: app.globalData,
    })
    this.syncCustom({
      blur: e.detail.value,
      hue: wx.getStorageSync('hue') ? wx.getStorageSync('hue') : 347
    })
  },
  async changeSecret(e) {
    let that = this;
    if(!wx.getStorageSync('openid')) {
      this.setData({
        toastBolX: true,
        toastTitleX: "请先登录",
        toastDurationX: 2000
      })
    }
    else {
      let bol = e.detail.value;
      wx.showModal({
        title: bol === true ? '是否开启' : '是否关闭',
        content: bol === true ? '开启后他人将不能查看你的日记，收藏，关注、粉丝和个人资料。' : '关闭后他人将能查看你的日记，收藏，关注、粉丝和个人资料。',
        success(val) {
  
          if(val.confirm === true) {
            wx.cloud.callFunction({
              name: 'updateUserSecret',
              data: {
                openid: wx.getStorageSync('openid'),
                secret: bol
              },
              success(res) {
                let copy = JSON.parse(JSON.stringify(that.data.info))
                copy.secret = e.detail.value;
                that.setData({
                  info: copy
                })
                console.log(res)  
              }
            })              
          }
          else {
            let copy = JSON.parse(JSON.stringify(that.data.info))
            copy.secret = !e.detail.value;
            that.setData({
              info: copy
            })
          }
        }   
      })

    }

    
  },
  changeBackground(e) {
    this.data.globalData.background = e.detail.value;
    wx.setStorageSync('background', e.detail.value);
    app.globalData.background = e.detail.value;
    this.setData({
      globalData: app.globalData,
    })
    this.syncCustom({
      background_bol: e.detail.value,
      hue: wx.getStorageSync('hue') ? wx.getStorageSync('hue') : 347
    })
  },

  //获取用户数据
  async bindgetuserinfo(e) {
    console.log(e);

    let timer = null;
    clearInterval(timer)
    timer = setInterval( async () =>{
      if(this.data.userInfoBoolean) {
        clearInterval(timer)
        this.setData({
          userInfoBoolean: false
        })
        if(e.detail.errMsg !== "getUserInfo:ok") {
          return;
        }
        if (wx.getStorageSync('openid')) {
          return;
        }
    
        this.setData({
          toastBol: true
        })
        app.globalData.initBol = false;
        const res = await app.onGetOpenid();
        wx.setStorageSync('openid', res.openid)
        if (res.status === 'ok') {
          let ifUser = await app.ifUser(res.openid);
          console.log(ifUser,'======================')
          //获取值
          if (ifUser.res.status === 'ok') {
            // console.log(ifUser.res.data)
            let copy = JSON.parse(JSON.stringify(ifUser.res.data))
            copy.userInfo = this.data.newUserInfo
            wx.setStorageSync('user', copy)
            await app.initData();
            this.getGlobalData();
          }
          //创建用户
          else if (ifUser.res.status === 'err') {
            let createUser = await app.createUser(res.openid, this.data.newUserInfo)
            await app.initData();
            this.getGlobalData();
          }
        } else {
          console.log('错误')
        }
        this.setData({
          stopTimer: false
        })
      }
      else {
        console.log(11)
        if(this.data.stopTimer) {
          clearInterval(timer)
          this.setData({
            stopTimer: false
          })
        }
      }
    },100)
  },
  //通过新接口获得用户数据
  getNewUserInfo() {
    if (wx.getStorageSync('openid')) {
      wx.getUserProfile({
        desc: '用于展示你的用户名头像和昵称', 
        success: async (val) => {
          console.log(val)
          this.setData({
            userInfoBoolean: false,
            stopTimer: true
          })
          await app.initDataX(val);
          this.getGlobalData();
        },
        fail: async (val) => {
          this.setData({
            userInfoBoolean: false,
            stopTimer: true
          })
        }
      })
    }else {
      let userInfoTimer = null;
      clearInterval(userInfoTimer)
      wx.getUserProfile({
        desc: '用于展示你的用户名头像和昵称', 
        success: async (val) => {
          console.log(val)
          this.setData({
            userInfoBoolean: true,
            newUserInfo: val.userInfo
          })
        },
        fail: async (val) => {
          this.setData({
            userInfoBoolean: false,
            stopTimer: true
          })
        }
      })
    }
  },
  //日记开关权限控制
  async controlDiary(e) {
    this.setData({
      controlDiary_bol: e.detail.value
    })
    let res = await wx.cloud.callFunction({
      name: 'controlDiary',
      data: {
        openid: wx.getStorageSync('openid'),
        bol: e.detail.value
      }
    })
    console.log(res)
    if (res.result.stats.updated === 1) {}
  },

  //评论控制
  async controlChat(e) {
    this.setData({
      controlChat_bol: e.detail.value
    })
    let res = await wx.cloud.callFunction({
      name: 'controlChat',
      data: {
        openid: wx.getStorageSync('openid'),
        bol: e.detail.value
      }
    })
    if (res.result.stats.updated === 1) {}
  },

  //获取日记开关状态
  async getControlDiary() {
    let res = await wx.cloud.callFunction({
      name: 'getAdmin',
      data: {
        openid: wx.getStorageSync('openid')
      }
    })
    console.log(res)
    if (res.result.errMsg === "collection.get:ok") {
      this.setData({
        controlDiary_bol: res.result.data[0].controlDiary,
        controlChat_bol: res.result.data[0].controlChat
      })
    }
  },
  //上传背景图-选择图片
  async chooseBackground() {
    if(!wx.getStorageSync('openid')) {
        this.setData({
          toastBolX: true,
          toastTitleX: "请先登录",
          toastDurationX: 2000
        })
        return false;
    }
    let that = this;
    let res = await wx.chooseImage({
      count: 1,
    })
    let filePath = res.tempFilePaths[0];
    let pattern = /\.{1}[a-z]{1,}$/;
    let cc = filePath.slice(0, pattern.exec(filePath).index);
    cc = cc.slice(11);
    let openid = wx.getStorageSync('openid');
    let cloudPath = 'user/' + openid + '/backgroundImg/' + cc + filePath.match(/\.[^.]+?$/)[0];
    that.setData({
      toastBol1: true
    })
    let res1 = await wx.cloud.uploadFile({
      cloudPath,
      filePath,
    })

    let res2 = await wx.cloud.callFunction({
      name: 'updateCustom',
      data: {
        openid: wx.getStorageSync('openid'),
        update: {
          background_url: res1.fileID
        }
      }
    })
    // console.log(res2)
    if (res2.result.stats.updated === 1) {
      that.setData({
        toastBol1: false
      })
      await app.initData();
      that.getGlobalData();
    }

  },
  //跳转到version
  toVersion() {
    wx.setStorageSync('version', this.data.version_num)
    wx.navigateTo({
      url: '/pages/version/version',
    })
  },
  //跳转到日志管理
  toEditVersion() {
    wx.navigateTo({
      url: '/pages/editVersion/editVersion',
    })
  },
  //跳转到个人资料
  toUserDetail() {
    if(wx.getStorageSync('openid')) {

      wx.navigateTo({
        url: '/pages/userDetail/userDetail',
      })
    }
    else {
      this.setData({
        toastBolX: true,
        toastTitleX: "请先登录",
        toastDurationX: 2000
      })
    }  
  },
  //跳转到问题反馈列表
  async toQuestion() {
    //把users集合的answer true改为false
    if(wx.getStorageSync('openid')) {

      wx.navigateTo({
        url: '/pages/myQuestion/myQuestion',
      })
    }
    else {
      this.setData({
        toastBolX: true,
        toastTitleX: "请先登录",
        toastDurationX: 2000
      })
    }
  },

  //管理员权限：跳转到用户问题列表
  toUserQuestion() {
    wx.navigateTo({
      url: '/pages/userQuestion/userQuestion',
    })
  },
  //管理员权限：跳转到用户列表
  toUserList() {
    wx.navigateTo({
      url: '/pages/adminUser/adminUser',
    })
  },
  //管理员权限：跳转到日记列表
  toDiaryList() {
    wx.navigateTo({
      url: '/pages/adminDiary/adminDiary',
    })
  },

  //管理员权限：电影日记列表
  toFilm() {
    wx.navigateTo({
      url: '/pages/film/film',
    })
  },


  //获取日志版本
  async getVersion_one() {
    let version = await wx.cloud.callFunction({
      name: 'getVersionOne'
    });
    let res = version.result.data[0].version
    if(wx.getStorageSync('version')) {
      if(wx.getStorageSync('version') === res) {
        this.setData({
          version_text: "",
          version_num: res
        })
      }
      else {
        this.setData({
          version_text: "新版本介绍",
          version_num: res
        })
      }
    }
    else {
      this.setData({
        version_text: "新版本介绍",
        version_num: res
      })
    }
    // console.log(version.result.data[0].version)
  },

  //获取提交回复
  async getAnswerBol() {
    if(!wx.getStorageSync('openid')) {
      return;
    }
    let version = await wx.cloud.callFunction({
      name: 'getAnswerBol',
      data: {
        openid: wx.getStorageSync('openid')
      }
    });
    let res = version.result.data[0].answer
    if(res === true) {
      this.setData({
        answer_text: "新问题回复"
      })
    }
    else {
      this.setData({
        answer_text: ""
      })
    }
  },

  //跳转到我的日记
  toMyDiary() {
    wx.navigateTo({
      url: '/pages/myDiary/myDiary',
    })
  },

  //跳转到我的收藏
  toMyCollection() {
    wx.navigateTo({
      url: '/pages/myCollection/myCollection',
    })
  },

    //跳转到他的关注
    toMyWatch() {
      let id = wx.getStorageSync('openid')
      wx.navigateTo({
        url: '/pages/myWatch/myWatch?id='+id,
      })
    },
  
    //跳转到他的粉丝
    toMyFans() {
      let id = wx.getStorageSync('openid')
      wx.navigateTo({
        url: '/pages/myFans/myFans?id='+id,
      })
    },

    //跳转到用户列表
    toAdminUser() {
      wx.navigateTo({
        url: '/pages/adminUser/adminUser'
      })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.toAsync();
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
    this.toAsync();
  },
  async toAsync() {
    this.firstHeader();
    await app.initData();
    this.getGlobalData();
    this.getVersion_one();
    this.getAnswerBol();
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
