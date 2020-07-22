import {defineComponent} from "vue";

const ElFooter = defineComponent({
  name: "ElFooter",
  props: {
    height: {
      type: String,
      default: "60px"
    }
  },
  setup (props, {slots}) {
    return () => (
      <footer class="el-footer" style={{height: props.height}}>
        {slots.default?.()}
      </footer>
    )
  }
})

export default ElFooter