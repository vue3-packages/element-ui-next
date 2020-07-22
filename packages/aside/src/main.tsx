import {defineComponent} from "vue"

const ElAside = defineComponent({
  name: "ElAside",
  props: {
    width: {
      type: String,
      default: "300px"
    }
  },
  setup (props, {slots}) {
    return () => (
      <aside class="el-aside" style={{ width: props.width }}>
        {slots.default?.()}
      </aside>
    )
  }
})

export default ElAside