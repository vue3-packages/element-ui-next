import {defineComponent, h, computed, getCurrentInstance, inject} from "vue"
import {AnyObj} from "../../../src/types/index"

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
  setup (props, {slots}) {
    let classList: string[] = [];
    let style: AnyObj = {};
    const gutter = inject("elRowGutter")
    // let instance = getCurrentInstance()
    // const gutter = computed(() => {
    //   let parent = instance?.parent;
    //   while (parent && parent.type.name !== "ElRow") {
    //     parent = parent.parent;
    //   }
    //   // @ts-ignore
    //   return parent ? parent.gutter.value : 0;
    // })
    // // @ts-ignore
    // instance.gutter = gutter

    if (gutter) {
      style.paddingLeft = (gutter as number) / 2 + "px";
      style.paddingRight = style.paddingLeft;
    }

    ["span", "offset", "pull", "push"].forEach(prop => {
      if (props[prop] || props[prop] === 0) {
        classList.push(
          prop !== "span"
            ? `el-col-${prop}-${props[prop]}`
            : `el-col-${props[prop]}`
        );
      }
    });

    ["xs", "sm", "md", "lg", "xl"].forEach(size => {
      if (typeof props[size] === "number") {
        classList.push(`el-col-${size}-${props[size]}`);
      } else if (typeof props[size] === "object") {
        let props_ = props[size];
        Object.keys(props_).forEach(prop => {
          classList.push(
            prop !== "span"
              ? `el-col-${size}-${prop}-${props_[prop]}`
              : `el-col-${size}-${props_[prop]}`
          );
        });
      }
    });

    return () => h(props.tag, {
      class: ["el-col", classList],
      style
    }, slots.default?.())
  }
})

export default ElCol