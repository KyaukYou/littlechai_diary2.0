//app.js
App({
  onLaunch: function () {

    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight;
        this.globalData.customHeight = wx.getMenuButtonBoundingClientRect();
      }, fail(err) {
        console.log(err);
      }
    })

    if(wx.getStorageSync('color')) {
      this.globalData.color = wx.getStorageSync('color');
    }
    if(wx.getStorageSync('blur')) {
      this.globalData.blur = wx.getStorageSync('blur');
    }
    if(wx.getStorageSync('background')) {
      this.globalData.background = wx.getStorageSync('background');
    }


    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  },
  changeColor(color) {
    this.globalData.color = color;
  },
  globalData: {
    //全局颜色
    color: "rgb(244,118,149)",
    blur: false,
    background: false
  }
})
