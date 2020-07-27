import { defineComponent, h, computed, provide } from "vue"
import {AnyObj} from "../../../src/types/index"
import concatClassName from "../../../src/tools/concatClassName"

const ElRow = defineComponent({
  name: "ElRow",
  props: {
    tag: {
      type: String,
      default: "div"
    },
    gutter: Number,
    type: String,
    justify: {
      type: String,
      default: "start"
    },
    align: {
      type: String,
      default: "top"
    }
  },
  setup(props, {slots, attrs}) {
    const style = computed(() => {
      const ret: AnyObj = {};

      if (props.gutter) {
        ret.marginLeft = `-${props.gutter / 2}px`;
        ret.marginRight = ret.marginLeft;
      }

      return ret;
    })
    provide("elRowGutter", props.gutter)
    let classList = [
      "el-row",
      props.justify !== "start" ? `is-justify-${props.justify}` : "",
      props.align !== "top" ? `is-align-${props.align}` : "",
      { "el-row--flex": props.type === "flex" }
    ]
    const attrClass = (attrs?.class as string)?.split(" ")
    classList = concatClassName(classList, attrClass)
    return () => h(props.tag, {
      class: classList,
      style: style.value
    }, slots.default?.())
  }
})

export default ElRow