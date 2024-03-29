import zIndex from "../behaviors/zIndex";
Component({
  behaviors: [zIndex],
  externalClasses: ["l-class", "l-mask-class"],
  properties: {
    show: {
      type: Boolean,
      value: !1
    },
    opacity: {
      type: [String, Number],
      value: .4
    },
    zIndex: {
      type: Number,
      value: 700
    },
    center: {
      type: Boolean,
      value: !1
    },
    locked: {
      type: Boolean,
      value: !0
    },
    fullScreen: {
      type: String,
      value: ""
    },
    NavColor: {
      type: String,
      value: ""
    }
  },
  data: {},
  methods: {
    doNothingMove() {},
    onMaskTap() {
      !0 !== this.data.locked && this.setData({
        show: !1
      }), this.triggerEvent("lintap", !0, {
        bubbles: !0,
        composed: !0
      })
    }
  },
  attached: function () {}
});