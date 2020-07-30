import { defineComponent, PropType } from "vue"
const ElDivider = defineComponent({
  name: "ElDivider",
  props: {
    direction: {
      type: String as PropType<"horizontal" | "vertical">,
      default: "horizontal",
    },
    contentPosition: {
      type: String as PropType<"left" | "center" | "right">,
      default: "center",
    }
  },
  setup(props, (solts)){
    return () => (
      <div
      // v-bind="data.attrs"
      // v-on="listeners"
      class={[data.staticClass, "el-divider", `el-divider--${props.direction}`]}
    >
      {solts.default && props.direction !== "vertical" ? <div
        class={["el-divider__text", `is-${props.contentPosition}`]}
       >
        {solts.default?.()}
      </div> : ""}
    </div>
    )
  }
})
export default ElDivider
