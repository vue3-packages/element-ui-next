import {defineComponent} from "vue"

const ElMain = defineComponent({
  name: "ElMain",
  setup (props, {slots}) {
    return () => (
      <main class="el-main">
        {slots.default?.()}
      </main>
    )
  }
})

export default ElMain