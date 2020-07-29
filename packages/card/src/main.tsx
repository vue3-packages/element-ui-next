import {defineComponent} from "vue"
import concatClassName from "../../../src/tools/concatClassName"

const ElCard = defineComponent({
  name: "ElCard",
  props: {
    header: {},
    bodyStyle: {},
    shadow: {
      type: String
    }
  },
  setup(props, {slots, attrs}) {
    let classList = [
      "el-card",
      `${props.shadow ? "is-" + props.shadow + "-shadow" : "is-always-shadow"}`
    ]
    return () => (
      <div
      class={classList}>
        {
          slots.header || props.header ? (
            <div class="el-card__header">
              <slot name="header">{ slots.header?.() }</slot>
            </div>
          ) : ("")
        }
        <div class="el-card__body" style="bodyStyle">
          {slots.default?.()}
        </div>
      </div>
    )
  }
})

export default ElCard