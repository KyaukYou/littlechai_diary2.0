const app = require('../../app')

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
    heightInfo: {
      type: Object,
      value: {}
    }
  },
  ready() {
    this.init();
  },
  methods: {
    init(e) {
      // 这里可以进行数据操作
      // console.log(this.data.heightInfo,this.data.header_title)
    },
  }
})
