import eventBus from "../core/utils/event-bus.js";
import validator from "../behaviors/validator";
import rules from "../behaviors/rules";
import * as config from "./config";
import formatFlags from "./dete";
import {
  getDayByOffset,
  getDate,
  compareDay,
  calcDateNum,
  copyDates,
  getTime,
  formatMonthTitle,
  compareMonth,
  getMonths
} from "./util";
Component({
  externalClasses: ["l-class"],
  behaviors: ["wx://form-field", validator, rules],
  properties: {
    show: {
      type: Boolean,
      value: !1,
      observer(t) {
        t && (this.initRect(), this.scrollIntoView())
      }
    },
    type: {
      type: String,
      value: config.TYPE_SINGLE,
      options: [config.TYPE_SINGLE, config.TYPE_MULTIPLE, config.TYPE_RANGE],
      observer() {
        this.setData({
          currentDate: this.initCurrentDate()
        })
      }
    },
    color: {
      type: String,
      value: ""
    },
    defaultDate: {
      type: [String, Number, Date, Array],
      value: "",
      observer() {
        this.setData({
          currentDate: this.initCurrentDate()
        })
      }
    },
    format: {
      type: String,
      value: "timestamp"
    },
    formatter: {
      type: [Function, null],
      value: null
    },
    minDate: {
      type: [String, Number, null],
      value: Date.now()
    },
    maxDate: {
      type: [String, Number, null],
      value: new Date((new Date).getFullYear(), (new Date).getMonth() + 6, (new Date).getDate()).getTime()
    },
    minSelect: {
      type: [Number, null],
      value: null
    },
    maxSelect: {
      type: [Number, null],
      value: null
    },
    allowSameDay: Boolean,
    showConfirm: {
      type: Boolean,
      value: !0
    },
    confirmText: {
      type: String,
      value: "确认"
    },
    maxLimitMessage: {
      type: String
    },
    minLimitMessage: {
      type: String
    },
    showTitle: {
      type: Boolean,
      value: !0
    },
    showSubtitle: {
      type: Boolean,
      value: !0
    },
    title: {
      type: String,
      value: "日期选择"
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        currentDate: this.initCurrentDate()
      })
    },
    ready() {
      this.data.show && (this.initRect(), this.scrollIntoView())
    }
  },
  data: {
    currentDate: null,
    types: config,
    subTitle: "",
    scrollIntoViewIndex: ""
  },
  methods: {
    clickDay(t) {
      const {
        type: e,
        currentDate: a,
        maxLimitMessage: i,
        maxSelect: r,
        allowSameDay: n
      } = this.data, {
        date: s
      } = t.detail;
      if (e === config.TYPE_SINGLE && (this.setData({
          currentDate: getTime(s)
        }), this.triggerEvent("linclickday", copyDates(s)), this.triggerEvent("linselect", copyDates(s))), e === config.TYPE_MULTIPLE) {
        let t = null;
        if (a.some((e, a) => {
            const i = 0 === compareDay(e, s);
            return i && (t = a), i
          })) a.splice(t, 1), this.setData({
          currentDate: getTime(a)
        }), this.triggerEvent("linunselect", copyDates(a));
        else {
          if (r && a.length >= r) return wx.lin.showToast({
            title: i || `选择天数不能超过 ${r} 天`
          }), void this.triggerEvent("linclickday", copyDates(s));
          this.setData({
            currentDate: getTime([...a, s])
          }), this.triggerEvent("linselect", copyDates([...a, s]))
        }
        this.triggerEvent("linclickday", copyDates(s))
      }
      if (e === config.TYPE_RANGE) {
        const [t, e] = a;
        if (t && !e) {
          const e = compareDay(s, t);
          1 === e ? this.checkSelectRange([t, s]) && (this.setData({
            currentDate: getTime([t, s])
          }), this.triggerEvent("linselect", copyDates([t, s]))) : -1 === e ? this.setData({
            currentDate: getTime([s, null])
          }) : n && this.setData({
            currentDate: getTime([s, s])
          })
        } else this.setData({
          currentDate: getTime([s, null])
        })
      }
    },
    checkSelectRange(t) {
      const {
        maxSelect: e,
        maxLimitMessage: a,
        minSelect: i,
        minLimitMessage: r
      } = this.data;
      return e && calcDateNum(t) > e ? (wx.lin.showToast({
        title: a || `选择天数不能超过 ${e} 天`
      }), !1) : !(i && calcDateNum(t) < i) || (wx.lin.showToast({
        title: r || `选择天数不能少于 ${i} 天`
      }), !1)
    },
    initCurrentDate() {
      const {
        type: t,
        minDate: e,
        defaultDate: a,
        maxDate: i
      } = this.data, r = Array.isArray(a);
      if (t === config.TYPE_SINGLE) return a ? r || -1 === compareDay(a, e) ? e : 1 === compareDay(a, i) ? i : a : e;
      if (t === config.TYPE_MULTIPLE) return a ? r ? a.filter(t => 1 === compareDay(t, e) && -1 === compareDay(t, i)) : -1 === compareDay(a, e) ? [e] : 1 === compareDay(a, i) ? [i] : [e] : [];
      if (t === config.TYPE_RANGE) {
        if (r) {
          let [t = e, r] = a;
          return -1 !== compareDay(t, e) && -1 === compareDay(t, i) || (t = e), r || (r = getDayByOffset(getDate(t), 1).getTime()), 1 !== compareDay(r, i) && -1 !== compareDay(r, e) || (r = getDayByOffset(getDate(t), 1).getTime()), [t, r]
        }
        return [e, getDayByOffset(getDate(e), 1).getTime()]
      }
    },
    initRect() {
      null !== !this.contentObserver && void 0 !== this.contentObserver && this.contentObserver.disconnect();
      const t = this.createIntersectionObserver({
        thresholds: [0, .1, .9, 1],
        observeAll: !0
      });
      this.contentObserver = t, t.relativeTo(".calendar-body-wrap"), t.observe(".month", t => {
        t.boundingClientRect.top <= t.relativeRect.top && this.setData({
          subTitle: formatMonthTitle(t.dataset.date)
        })
      })
    },
    scrollIntoView() {
      setTimeout(() => {
        const {
          currentDate: t,
          type: e,
          show: a,
          minDate: i,
          maxDate: r
        } = this.data, n = "single" === e ? t : t[0];
        if (!n || !a) return;
        getMonths(i, r).some((t, e) => 0 === compareMonth(t, n) && (this.setData({
          scrollIntoViewIndex: "month" + e
        }), !0))
      }, 100)
    },
    closePicker() {
      // this.setData({
      //   show: !1
      // })
      console.log(1)
    },
    onClickConfirm() {
      const {
        format: t,
        type: e,
        currentDate: a
      } = this.data;
      eventBus.emit("lin-form-blur-" + this.id, this.id);
      let i = null;
      i = "single" === e ? "timestamp" !== t ? formatFlags.format("yyyy-MM-dd", a) : a : a.map(e => "timestamp" !== t ? formatFlags.format("yyyy-MM-dd", e) : e), this.triggerEvent("linconfirm", i)
    },
    getValues() {
      return this.data.currentDate
    },
    reset() {
      this.setData({
        currentDate: null
      })
    }
  }
});