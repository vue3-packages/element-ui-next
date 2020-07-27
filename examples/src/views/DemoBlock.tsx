import {defineComponent} from "vue"
import "./DemoBlock.scss"

export default defineComponent({
  name: "demo-block",
  setup(props, {slots}) {
    return () => (
      <>
        <div class="demo-block-description">{slots.description?.()}</div>
        {slots.default?.()}
      </>
    )
  }
})