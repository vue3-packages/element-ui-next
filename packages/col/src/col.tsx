import {defineComponent, computed} from "vue"

const ElCol = defineComponent({
  name: "ElCol",
  props: {
    span: {
      type: Number,
      default: 24
    },
    tag: {
      type: String,
      default: "div"
    },
    offset: Number,
    pull: Number,
    push: Number,
    xs: [Number, Object],
    sm: [Number, Object],
    md: [Number, Object],
    lg: [Number, Object],
    xl: [Number, Object]
  },
  setup (props, {}) {
    return () => {

    }
  }
})

export default ElCol