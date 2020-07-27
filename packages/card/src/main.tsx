import {defineComponent} from "vue"

const ElCard = defineComponent({
  name: "ElCard",
  props: {
    header: {},
    bodyStyle: {},
    shadow: {
      type: String
    }
  },
  setup(props, {slots}) {
    return () => (
      <div
      class={`el-card ${props.shadow ? "is-" + props.shadow + "-shadow" : "is-always-shadow"}`}>
        <div class="el-card__header" v-if="$slots.header || header">
          <slot name="header">{ slots.header?.() }</slot>
        </div>
        <div class="el-card__body" style="bodyStyle">
          {slots.default?.()}
        </div>
      </div>
    )
  }
})

export default ElCard