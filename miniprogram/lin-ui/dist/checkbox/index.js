Component({
  behaviors: ["wx://form-field"],
  externalClasses: ["l-class", "l-disabled-class"],
  relations: {
    "../checkbox-group/index": {
      type: "parent"
    }
  },
  options: {
    multipleSlots: !0
  },
  properties: {
    placement: {
      type: String,
      value: "left"
    },
    custom: {
      type: Boolean,
      value: !1
    },
    key: {
      type: String,
      value: ""
    },
    cell: {
      type: Object,
      value: {}
    },
    size: {
      type: String,
      value: "38rpx"
    },
    disabled: {
      type: Boolean,
      value: !1
    },
    selectColor: {
      type: String,
      value: "#3963BC"
    },
    disabledColor: {
      type: String,
      value: "#ccc"
    },
    color: {
      type: String,
      value: "#ccc"
    },
    checked: {
      type: Boolean,
      value: !1
    }
  },
  data: {
    parentPlacement: ""
  },
  ready() {
    const e = this.getRelationNodes("../checkbox-group/index")[0];
    let {
      placement: t
    } = e.properties;
    this.setData({
      parentPlacement: t
    })
  },
  methods: {
    onCheckboxChangeTap() {
      if (this.properties.disabled || this.data.parentDisabled) return;
      const e = this.getRelationNodes("../checkbox-group/index")[0];
      if (this.properties.checked) {
        if (this.isOverflow("minSelected")) return
      } else if (this.isOverflow("maxSelected")) return;
      const t = {
        checked: !this.properties.checked,
        key: this.properties.key,
        cell: this.properties.cell
      };
      e && e.onEmitEventHandle(t)
    },
    isOverflow(e) {
      const t = this.getRelationNodes("../checkbox-group/index")[0],
        l = t.properties[e];
      if (!l) return !1;
      const i = Object.values(t._selected).length;
      let o = "minSelected" === e ? i <= l : i >= l;
      if (o) {
        let i = "minSelected" === e ? "min_selected" : "max_selected";
        t.onEmitOverflowHandle && t.onEmitOverflowHandle({
          key: this.properties.key,
          limitNumber: l,
          type: "overflow_" + i
        })
      }
      return o
    }
  }
});