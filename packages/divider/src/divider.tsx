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
  setup(props, {slots}){
    return () => (
      <div
      // v-bind="data.attrs"
      // v-on="listeners"
      class={[ "el-divider", `el-divider--${props.direction}`]}
    >
      {slots.default && props.direction !== "vertical" ? <div
        class={["el-divider__text", `is-${props.contentPosition}`]}
       >
        {slots.default?.()}
      </div> : ""}
    </div>
    )
  }
})
export default ElDivider
