// pages/userDetail/userDetail.js
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
    region: ['请选择', '请选择', '请选择'],
    birth: '请选择',
    gender: ['请选择'],
    genderData: ['男', '女', '其他'],
    age: '请选择出生日期',
    agePer: '',
    email: '',
    goodat: '',
    startDate: '',
    endDate: '',
    shenxiao: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],
    showBol: true
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



  // 我的邮箱
  emailChange(e) {
    // // console.log(e.detail.value);
    this.setData({
      email: e.detail.value
    })
  },
  // 省市区三级联动
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    var detail = e.detail.value[0] + '-' + e.detail.value[1] + '-' + e.detail.value[2]
    this.setData({
      region: e.detail.value
    });


  },
  // 出生日期
  bindBirthChange: function (e) {
    // // console.log('picker发送选择改变，携带值为', e.detail.value)
    // console.log(e)
    this.setData({
      birth: e.detail.value
    })

    var date = new Date();
    var year = date.getFullYear();
    // // console.log(year - Number(this.data.birth.slice(0,4)));
    var cha = year - Number(this.data.birth.slice(0, 4));


    var sx = this.getPet(this.data.birth.slice(0, 4));


    this.setData({
      age: [cha, sx],
      agePer: cha + '岁' + ', 属' + sx
    })
    // this.data.year
  },
  changeBirth: function (val) {
    this.setData({
      birth: val
    })

    var date = new Date();
    var year = date.getFullYear();
    // // console.log(year - Number(this.data.birth.slice(0,4)));
    var cha = year - Number(this.data.birth.slice(0, 4));


    var sx = this.getPet(this.data.birth.slice(0, 4));


    this.setData({
      age: [cha, sx],
      agePer: cha + '岁' + ', 属' + sx
    })
  },
  // 性别
  bindGenderChange: function (e) {
    this.setData({
      gender: this.data.genderData[e.detail.value]
    })
  },
  //擅长描述
  bindTextareaChange: function (e) {
    // // console.log(e.detail.value)
    this.setData({
      goodat: e.detail.value
    })
  },
  getPet: function (val) {
    var toYear = 1889;
    var birthYear = val;
    var birthpet = "Ox";
    var x = (toYear - birthYear) % 12;
    if ((x == 1) || (x == -11)) {
      birthpet = "鼠"
    } else {
      if (x == 0) {
        birthpet = "牛"
      } else {
        if ((x == 11) || (x == -1)) {
          birthpet = "虎"
        } else {
          if ((x == 10) || (x == -2)) {
            birthpet = "兔"
          } else {
            if ((x == 9) || (x == -3)) {
              birthpet = "龙"
            } else {
              if ((x == 8) || (x == -4)) {
                birthpet = "蛇"
              } else {
                if ((x == 7) || (x == -5)) {
                  birthpet = "马"
                } else {
                  if ((x == 6) || (x == -6)) {
                    birthpet = "羊"
                  } else {
                    if ((x == 5) || (x == -7)) {
                      birthpet = "猴"
                    } else {
                      if ((x == 4) || (x == -8)) {
                        birthpet = "鸡"
                      } else {
                        if ((x == 3) || (x == -9)) {
                          birthpet = "狗"
                        } else {
                          if ((x == 2) || (x == -10)) {
                            birthpet = "猪"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return birthpet;
  },
  async getData() {
    var that = this;
    let openid = wx.getStorageSync('openid')
    let res = await wx.cloud.callFunction({
      name: 'getUserDetail',
      data: {
        openid: openid
      }
    })
    let result = res.result.data[0].userDetail;
    let newAge = [];
    let newRegion = [];
    for (var k in result.age) {
      newAge.push(result.age[k])
    }
    for (var s in result.where) {
      newRegion.push(result.where[s])
    }
    // console.log(newAge)
    that.setData({
      birth: result.birth,
      // agePer: newAge[0]+'岁,属'+newAge[1],
      region: newRegion,
      goodat: result.info,
      email: result.email
    })
    var date = new Date();
    var year = date.getFullYear();
    var cha = year - Number(that.data.birth.slice(0, 4));


    var sx = that.getPet(that.data.birth.slice(0, 4));


    that.setData({
      showBol: true,
      age: [cha, sx],
      agePer: cha + '岁' + ', 属' + sx
    })
  },

  async saveDetail() {
    let that = this;
    if (this.data.birth != '请选择' && this.data.region[0] != '请选择' && this.data.goodat != '' && this.data.email != '') {
      // if(this.data.email)
      var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); 
      if (!reg.test(this.data.email)) {
        this.setData({
          loadingBol: true,
          loadingIcon: 'error',
          loadingTitle: '邮箱格式错误',
          loadingDuration: 1500
        })
      }else {
        this.setData({
          loadingBol: true,
          loadingIcon: 'loading',
          loadingTitle: '保存中',
          loadingDuration: 99999
        })
        let openid = wx.getStorageSync('openid');
        let  res = await wx.cloud.callFunction({
          name: 'updateUserDetail',
          data: {
            openid: openid,
            userDetail: {
              birth: that.data.birth,
              age: that.data.age,
              region: that.data.region,
              goodat: that.data.goodat,
              email: that.data.email,
              info: that.data.goodat,
              updatedTime: await app.timeStampX(new Date().getTime())
            }
          },
          
        })
        console.log(res)
        if(res.result.errMsg === "collection.update:ok") {
          this.setData({
            loadingBol: true,
            loadingIcon: 'success',
            loadingTitle: '保存成功',
            loadingDuration: 1500
          })
        }else {
          this.setData({
            loadingBol: true,
            loadingIcon: 'error',
            loadingTitle: '保存失败',
            loadingDuration: 1500
          })
        }
      }
    }
    else {
      this.setData({
        loadingBol: true,
        loadingIcon: 'error',
        loadingTitle: '请填写完整',
        loadingDuration: 1500
      })
    }
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
      showBol: false,
    })
    this.getData();
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