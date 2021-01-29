//app.js
App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'littlechai-8gbpxj2baa4e412f',
        traceUser: true,
      })
    }


    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight;
        this.globalData.customHeight = wx.getMenuButtonBoundingClientRect();
      }, fail(err) {
        console.log(err);
      }
    })

    if(wx.getStorageSync('openid')) {
      if(!wx.getStorageSync('user')) {
        wx.removeStorageSync('openid')
      }
    }

    // 判断有没有openid,没有就是没有登录
    if(!wx.getStorageSync('openid') && !wx.getStorageSync('user')) {
      if(wx.getStorageSync('color')) {
        this.globalData.color = wx.getStorageSync('color');
      }
      if(wx.getStorageSync('blur')) {
        this.globalData.blur = wx.getStorageSync('blur');
      }
      if(wx.getStorageSync('background')) {
        this.globalData.background = wx.getStorageSync('background');
      }
      this.globalData.initBol = true;
      console.log(this.globalData.initBol)
    }
    // 登录了
    else {
      this.initData();
    }

  
  },
  async initData() {
      let openid = wx.getStorageSync('openid')
      let res = await this.ifUser(openid);
      console.log('a',res)
      let ifLogin = await wx.getSetting({});
      console.log(ifLogin)
      let forin = ifLogin.authSetting;
      let ifUserInfo = false;
      let arr = [];
      for(var k in forin) {
        arr.push(k)
      }
      console.log('none',res)
      if(arr.includes('scope.userInfo') && res.res.status !== "err") {
        console.log('one')
        let checkInfo = await wx.getUserInfo({})
        if(checkInfo.errMsg === "getUserInfo:ok") {
          console.log('two',checkInfo)
          if(checkInfo.userInfo.avatarUrl !== res.res.data.userInfo.avatarUrl || checkInfo.userInfo.nickName !== res.res.data.userInfo.nickName) {
            let newInfo = await wx.cloud.callFunction({
              name: 'updateCustom',
              data: {
                openid: wx.getStorageSync('openid'),
                update: {
                  "userInfo": checkInfo.userInfo
                }
              }
            })
            if(newInfo.result.stats.updated === 1) {
              await this.initData();
            }
          }
        }
      }

      console.log(res)
      if(res.res.status === 'ok') {
        let user = res.res.data;
        this.globalData.color = user.color;
        wx.setStorageSync('color', user.color);
        wx.setStorageSync('hue', user.hue);
        this.globalData.blur = user.blur;
        this.globalData.background = user.background_bol;
        wx.setStorageSync('blur', user.blur);
        wx.setStorageSync('background', user.background_bol);
        wx.setStorageSync('user', user);
        this.globalData.userInfo = user.userInfo;
        this.globalData.roles = user.roles;
      }
      else {
        if(wx.getStorageSync('color')) {
          this.globalData.color = wx.getStorageSync('color');
        }
        if(wx.getStorageSync('blur')) {
          this.globalData.blur = wx.getStorageSync('blur');
        }
        if(wx.getStorageSync('background')) {
          this.globalData.background = wx.getStorageSync('background');
        }
      }
      this.globalData.initBol = true;
  },
  changeColor(color) {
    this.globalData.color = color;
  },
  // 获取openid
  async onGetOpenid() {
    
    let res = await wx.cloud.callFunction({
      name: 'login',
      data: {},
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      return {
        status: 'ok',
        openid: res.result.openid
      }
    }
    else {
      return {
        status: 'err'
      }
    }
  },
  //注册用户
  async createUser(openid,userInfo) {
    let newUserInfo = userInfo;
    newUserInfo.headline = "";
    const userSchema = {
      openid: openid,
      userInfo: newUserInfo,
      created_time: await this.timeStampX(new Date().getTime()),
      updated_time: await this.timeStampX(new Date().getTime()),
      diary: [],
      diary_num: 0,
      background_url: "https://6c69-littlechai-8gbpxj2baa4e412f-1257711591.tcb.qcloud.la/system/default.jpg?sign=a77b8fd58e9edc5b370e7837ea5e7876&t=1610260942",
      color: wx.getStorageSync('color') || "rgb(244,118,149)",
      hue: wx.getStorageSync('hue') || 347,
      blur: this.globalData.blur,
      background_bol: this.globalData.background,
      like: [],
      dislike: [],
      collection: [],
      collection_num: 0,
      following: [],
      following_num: 0,
      fans: 0,
      roles: ["user"],
      lock: false,
      detail: {},
      answer: false
    }
    let res = await wx.cloud.callFunction({
      name: 'createUser',
      data: {
        user: userSchema
      }
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      wx.setStorageSync('user', userSchema)
      return {
        status: 'ok',
        res: res.result
      }
    }
    else {
      return {
        status: 'err',
        res: res.result
      }
    }
    console.log(userSchema)
  },
  //判断用户否存在
  async ifUser(openid) {
    let res = await wx.cloud.callFunction({
      name: 'ifUser',
      data: {
        openid: openid,
        time: await this.timeStampX(new Date().getTime())
      }
    })
    if (res.errMsg === "cloud.callFunction:ok") {
      return {
        status: 'ok',
        res: res.result
      }
    }
    else {
      return {
        status: 'err',
        res: res.result
      }
    }
  },

  async addZero(num) {
    let addNum;
    if (num <= 9) {
      addNum = "0" + num;
    } else {
      addNum = num;
    }
    return addNum;
  },

  //时间戳转化
  async timeStamp(time) {
    let timerX = new Date(time);
    let y = timerX.getFullYear();
    let m = timerX.getMonth() + 1;
    let d = timerX.getDate();
    let h = timerX.getHours();
    let m1 = timerX.getMinutes();
    let s = timerX.getSeconds();
    y = await this.addZero(y);
    m = await this.addZero(m);
    d = await this.addZero(d);
    h = await this.addZero(h);
    m1 = await this.addZero(m1);
    s = await this.addZero(s);
    // return `${y}-${m}-${d} ${h}:${m1}:${s}`;
    return `${y}-${m}-${d}`;
  },

  async timeStampX(time) {
    let timerX = new Date(time);
    let y = timerX.getFullYear();
    let m = timerX.getMonth() + 1;
    let d = timerX.getDate();
    let h = timerX.getHours();
    let m1 = timerX.getMinutes();
    let s = timerX.getSeconds();
    y = await this.addZero(y);
    m = await this.addZero(m);
    d = await this.addZero(d);
    h = await this.addZero(h);
    m1 = await this.addZero(m1);
    s = await this.addZero(s);
    return `${y}-${m}-${d} ${h}:${m1}:${s}`;
    // return `${y}-${m}-${d}`;
  },

  //获取两日期之间日期列表函数
  async getdiffdate(stime,etime){
    //初始化日期列表，数组
    let diffdate = new Array();
    let i=0;
    //开始日期小于等于结束日期,并循环
    while(stime<=etime){
        diffdate[i] = stime;
        
        //获取开始日期时间戳
        let stime_ts = new Date(stime).getTime();
        console.log('当前日期：'+stime   +'当前时间戳：'+stime_ts);
        
        //增加一天时间戳后的日期
        let next_date = stime_ts + (24*60*60*1000);
        
        //拼接年月日，这里的月份会返回（0-11），所以要+1
        let next_dates_y = new Date(next_date).getFullYear()+'-';
        let next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
        let next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();

        stime = next_dates_y+next_dates_m+next_dates_d;
        
        //增加数组key
        i++;
    }
    return diffdate;
  },

  //日期转时间戳  
  async dateToTimestamp(date) {
    return new Date(date).getTime()
  },

  globalData: {
    //全局颜色
    color: "rgb(244,118,149)",
    blur: false,
    background: false,
    initBol: false,
    userInfo: {},
    roles: ["user"]
  }
})
