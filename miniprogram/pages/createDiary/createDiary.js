// pages/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    back: true,
    globalData: {},
    toastTitle: "结束日期超出开始日期，为避免丢失日记信息，请重新选择日期时间段",
    toastDuration: 1600,
    toastBol: false,
    showBeginDate: false,
    showEndDate: false,
    minDate1: new Date(2021, 0, 1).getTime(),
    default_date: new Date().getTime(),
    maxDate1: "",
    minDate2: new Date().getTime(),
    maxDate2: "",
    info: {
      title: "",
      title_image: {
        type: 'default',
        url: "/images/wx.png"
      },
      location: "",
      beginDate: "",
      endDate: "",
      lock: false,
      show: true,
      sort: true,
      createdTime: "",
      updatedTime: "",
      ifDelete: false,
      ifTop: false,
      see: 0,
      collection: 0,
      like: 0,
      dayNum: 0,
      openid: ""
    },
    diaryArr: [
      // {
      //   date: "",
      //   show: true,
      //   content: "",
      //   imagesArr: [
      //     {
      //       type: "new",
      //       httpUrl: "",
      //       fileUrl: ""
      //     }
      //   ]
      // }
    ],
    uploadIcon: "",
    uploadDuration: 99999,
    uploadTitle: "",
    uploadBol: false
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
      if (app.globalData.initBol === true) {
        this.setData({
          globalData: app.globalData,
          refreshBol: false
        })
        clearInterval(timer);
      }
    }, 100)
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
    let that = this;
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        let copy = JSON.parse(JSON.stringify(this.data.info))
        copy.location = res.name + '(' + res.address + ')'
        this.setData({
          info: copy
        })
      },
      fail: function () {
        wx.getSetting({
          success: function (res) {
            var statu = res.authSetting;
            if (!statu['scope.userLocation']) {
              wx.showModal({
                title: '是否授权当前位置',
                content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
                success: function (tip) {
                  if (tip.confirm) {
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting["scope.userLocation"] === true) {
                          that.setData({
                            uploadDuration: 1600,
                            uploadTitle: "授权成功",
                            uploadBol: true
                          })
                          let maskTimer = setTimeout(() => {
                            that.setData({
                              uploadBol: false
                            })
                            clearTimeout(maskTimer)
                          }, 1600)
                        } else {
                          that.setData({
                            uploadDuration: 1600,
                            uploadTitle: "授权失败",
                            uploadBol: true
                          })
                          let maskTimer = setTimeout(() => {
                            that.setData({
                              uploadBol: false
                            })
                            clearTimeout(maskTimer)
                          }, 1600)
                        }
                      }
                    })
                  }
                }
              })
            }
          },
          fail: function (res) {
            that.setData({
              uploadDuration: 1600,
              uploadTitle: "调用授权窗口失败",
              uploadBol: true
            })
            let maskTimer = setTimeout(() => {
              that.setData({
                uploadBol: false
              })
              clearTimeout(maskTimer)
            }, 1600)
          }
        })
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
    console.log(y, m, d)

    let endDate = 0
    let beginDate = new Date(trueDate).getTime();
    if (this.data.info.endDate != "") {
      endDate = new Date(this.data.info.endDate).getTime();
    }
    console.log(endDate)
    if (endDate < beginDate && endDate !== 0) {
      // 提示
      this.setData({
        toastBol: true
      })
    } else {
      if (e.type === "linconfirm") {
        let res = await app.getdiffdate(copy.beginDate, copy.endDate)
        await this.initArr(res)
      }
    }
    this.setData({
      info: copy,
      minDate2: new Date(parseInt(y), parseInt(m) - 1, parseInt(d)).getTime()
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
    if (e.type === "linconfirm") {
      let res = await app.getdiffdate(copy.beginDate, copy.endDate)
      await this.initArr(res)
    }

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
    let copyArr = JSON.parse(JSON.stringify(this.data.diaryArr))
    this.setData({
      info: copy,
      diaryArr: copyArr.reverse()
    })
    // if(e.detail.value === false) {
    //   this.setData({
    //     info: copy,
    //     diaryArr: copyArr.reverse()
    //   })
    // }
    // else {
    //   this.setData({
    //     info: copy
    //   })
    // }
  },




  // 同步修改日记数组，核心算法
  async initArr(arr) {
    console.log(arr)
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr))
    if (this.data.info.sort === false) {
      copy.reverse();
    }
    //判断copy中有没有改日期内的数组

    //原本为空，直接赋值
    if (copy.length <= 0) {
      for (var i = 0; i < arr.length; i++) {
        let obj = {
          date: arr[i],
          show: true,
          content: "",
          imagesArr: []
        }
        copy.push(obj)
      }
      if (this.data.info.sort === false) {
        this.setData({
          diaryArr: copy.reverse()
        })
      } else {
        this.setData({
          diaryArr: copy
        })
      }

      return;
    }

    let beginTime1 = await app.dateToTimestamp(copy[0].date);
    let beginTime2 = await app.dateToTimestamp(arr[0]);
    let endTime1 = await app.dateToTimestamp(copy[copy.length - 1].date);
    let endTime2 = await app.dateToTimestamp(arr[arr.length - 1]);

    //开始日期比原来前
    // 2021-01-24  < 2021-01-26
    if (beginTime1 < beginTime2) {
      console.log('开始日期比原来前')
      let sliceIndex = null;
      //把前面的截取
      for (let j = 0; j < copy.length; j++) {
        if (await app.dateToTimestamp(copy[j].date) === await app.dateToTimestamp(arr[0])) {
          sliceIndex = j;
        }
      }
      copy = copy.slice(sliceIndex)
      console.log(copy)

    }

    //开始日期和原来一样
    // 2021-01-24  === 2021-01-24
    if (beginTime1 === beginTime2) {
      console.log('开始日期和原来一样')

      //判断结束日期
      //比原来早 2021-01-28 > 2021-01-27

      if (endTime1 > endTime2) {
        let num = null;
        for (let x = 0; x < copy.length; x++) {
          if (await app.dateToTimestamp(copy[x].date) === endTime2) {
            num = x;
          }
        }
        copy.splice(num + 1, copy.length - 1)
      }
      //和原来一样

      //比原来晚 2021-01-28 < 2021-01-29
      if (endTime1 < endTime2) {
        let num = null;
        let res = await app.getdiffdate(copy[copy.length - 1].date, arr[arr.length - 1]);
        console.log(res)
        for (let x = 1; x < res.length; x++) {
          let obj = {
            date: res[x],
            show: true,
            content: "",
            imagesArr: []
          }
          copy.push(obj)
        }
      }

    }


    //开始日期比原来后
    // 2021-01-24  > 2021-01-22
    if (beginTime1 > beginTime2) {
      console.log('开始日期比原来后')
      let res = await app.getdiffdate(arr[0], copy[0].date);
      res.reverse();
      for (let x = 1; x < res.length; x++) {
        let obj = {
          date: res[x],
          show: true,
          content: "",
          imagesArr: []
        }
        copy.unshift(obj)
      }
    }

    if (this.data.info.sort === false) {
      this.setData({
        diaryArr: copy.reverse()
      })
    } else {
      this.setData({
        diaryArr: copy
      })
    }



  },

  // 显示隐藏日记
  showArr(e) {
    let index = e.currentTarget.dataset.index;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr))
    copy[index].show = !copy[index].show
    this.setData({
      diaryArr: copy
    })
  },

  // 记录日记内容
  changeTextarea(e) {
    let index = e.currentTarget.dataset.index;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    copy[index].content = e.detail.value;
    this.setData({
      diaryArr: copy
    })
  },

  //选择日记封面
  async chooseTitleImage() {
    let res = await wx.chooseImage({
      count: 1,
    })
    console.log(res)
    let filePath = res.tempFilePaths[0];
    let copy = JSON.parse(JSON.stringify(this.data.info))
    copy.title_image = {
      type: 'new',
      url: filePath
    }
    this.setData({
      info: copy
    })
  },

  //选择日记独立图片
  async chooseDiaryImage(e) {
    let index = e.currentTarget.dataset.index;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    let chooseNum = 9 - copy[index].imagesArr.length
    let res = await wx.chooseImage({
      count: chooseNum,
    })
    let filePathArr = res.tempFilePaths;
    for (let i = 0; i < filePathArr.length; i++) {
      let obj = {
        type: "new",
        url: filePathArr[i]
      }
      copy[index].imagesArr.push(obj)
    }
    this.setData({
      diaryArr: copy
    })
  },

  //删除日记独立图片
  delDiaryImage(e) {
    let index1 = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    copy[index1].imagesArr.splice(index2, 1);
    this.setData({
      diaryArr: copy
    })
  },

  //查看大图
  watchBgImg(e) {
    let index1 = e.currentTarget.dataset.index;
    let index2 = e.currentTarget.dataset.index2;
    let copy = JSON.parse(JSON.stringify(this.data.diaryArr));
    let list = [];
    let getArr = copy[index1].imagesArr;
    for (let i = 0; i < getArr.length; i++) {
      list.push(getArr[i].url)
    }

    wx.previewImage({
      current: copy[index1].imagesArr[index2].url, // 当前显示图片的http链接
      urls: list // 需要预览的图片http链接列表
    })
  },
  //点击上传
  async upload() {
    let copy = JSON.parse(JSON.stringify(this.data.info));
    let copyDiary = JSON.parse(JSON.stringify(this.data.diaryArr));
    if (copy.title === "" || copy.title_image.type === 'default' || copy.location === "" || copy.beginDate === "" || copy.endDate === "") {
      this.setData({
        uploadIcon: "",
        uploadDuration: 1600,
        uploadTitle: "请填写完整",
        uploadBol: true
      })
      let maskTimer = setTimeout(() => {
        this.setData({
          uploadBol: false
        })
        clearTimeout(maskTimer)
      }, 1600)
    } else {

      if (await app.dateToTimestamp(this.data.info.beginDate) > await app.dateToTimestamp(this.data.info.endDate)) {
        this.setData({
          uploadDuration: 1600,
          uploadTitle: "日期时间段错误",
          uploadBol: true
        })
        let maskTimer = setTimeout(() => {
          this.setData({
            uploadBol: false
          })
          clearTimeout(maskTimer)
        }, 1600)
        return false;
      }
      // console.log(app.dateToTimestamp(this.data.info.beginDate) , app.dateToTimestamp(this.data.info.endDate)) 
      // return false;

      //上传封面图
      this.setData({
        uploadIcon: "loading",
        uploadDuration: 99999,
        uploadTitle: "上传封面中",
        uploadBol: true
      })
      let titleImageUrl = await this.uploadTitleImage(copy);
      copy.title_image.type = 'old';
      copy.title_image.url = titleImageUrl.fileID;
      // titleImageUrl.fileID
      console.log(titleImageUrl)

      //上传日记独立封面
      let diaryImageNum = 0;
      let diaryImageIndex = 0;
      let diaryImageArr = []
      for (let i = 0; i < copyDiary.length; i++) {
        diaryImageNum += copyDiary[i].imagesArr.length;
        diaryImageArr.push(copyDiary[i].imagesArr.length)
      }

      if (diaryImageNum === 0) {
        //直接上传
        let res = await this.uploadAll(copy, copyDiary)
      } else {
        //上传图片
        diaryImageIndex++;
        this.setData({
          uploadIcon: "loading",
          uploadDuration: 99999,
          uploadTitle: `上传图片中${diaryImageIndex}/${diaryImageNum}`,
          uploadBol: true
        })

        for (let i = 0; i < copyDiary.length; i++) {
          for (let j = 0; j < copyDiary[i].imagesArr.length; j++) {
            let res = await this.uploadDiaryImage(copyDiary[i].imagesArr[j].url);
            copyDiary[i].imagesArr[j].url = res.fileID;
            copyDiary[i].imagesArr[j].type = 'old';
            diaryImageIndex++;
            this.setData({
              uploadIcon: "loading",
              uploadDuration: 99999,
              uploadTitle: `上传图片中${diaryImageIndex}/${diaryImageNum}`,
              uploadBol: true
            })
          }
        }
        let res = await this.uploadAll(copy, copyDiary)

      }



    }
  },
  async uploadTitleImage(val) {
    let pattern = /\.{1}[a-z]{1,}$/;
    let cc = val.title_image.url.slice(0, pattern.exec(val.title_image.url).index);
    cc = cc.slice(11);
    let openid = wx.getStorageSync('openid');
    let cloudPath = 'user/' + openid + '/diary/' + cc + val.title_image.url.match(/\.[^.]+?$/)[0];
    let filePath = val.title_image.url
    let res = await wx.cloud.uploadFile({
      cloudPath,
      filePath,
    })
    return res
  },
  async uploadDiaryImage(val) {
    let pattern = /\.{1}[a-z]{1,}$/;
    let cc = val.slice(0, pattern.exec(val).index);
    cc = cc.slice(11);
    let openid = wx.getStorageSync('openid');
    let cloudPath = 'user/' + openid + '/diary/' + cc + val.match(/\.[^.]+?$/)[0];
    let filePath = val
    let res = await wx.cloud.uploadFile({
      cloudPath,
      filePath,
    })
    return res
  },
  async uploadAll(val1, val2) {
    console.log(val1, val2);
    this.setData({
      uploadIcon: "loading",
      uploadDuration: 99999,
      uploadTitle: `上传内容中`,
      uploadBol: true
    })
    val1.updatedTime = await app.timeStampX(new Date().getTime());
    val1.diaryArr = val2;
    val1.openid = wx.getStorageSync('openid');
    val1.dayNum = val2.length;
    const diarySchema = val1;

    let res = await wx.cloud.callFunction({
      name: 'createDiary',
      data: {
        diary: diarySchema
      }
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      this.setData({
        uploadIcon: "success",
        uploadDuration: 800,
        uploadTitle: `上传成功`,
        uploadBol: true
      })
      wx.cloud.callFunction({
        name: 'setUserDiaryNum',
        data: {
          openid: wx.getStorageSync('openid')
        }
      })
      let timer = setTimeout(() => {
        wx.navigateBack({
          delta: 1,
        })
        clearTimeout(timer)
      }, 800)
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