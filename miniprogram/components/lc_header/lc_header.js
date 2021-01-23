Component({
  data: {
    heightInfo: {}
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    header_title: {
      type: String,
      value: ""
    },
    header_color: {
      type: String,
      value: ""
    },
    header_image: {
      type: String,
      value: ""
    },
    blur: {
      type: Boolean,
      value: ""
    },
    back: {
      type: Boolean,
      value: false
    }
  },
  ready() {
    this.init();
  },
  methods: {
    backView(e) {
      // console.log(e)
      wx.navigateBack({
        delta: 1,
      })
    },
    init(e) {
      wx.getSystemInfo({
        success: res => {
          //导航高度
          this.setData({
            heightInfo: {
              navHeight: res.statusBarHeight,
              customHeight:wx.getMenuButtonBoundingClientRect()
            }
          })
          console.log(this.data.heightInfo)
        }, fail(err) {
          console.log(err);
        }
      })
      // 这里可以进行数据操作
      // console.log(this.data.heightInfo,this.data.header_title)
    },
  }
})
