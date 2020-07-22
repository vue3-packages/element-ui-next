import {defineComponent} from "vue"
import "./cHeader.scss"

const CHeader = defineComponent({
  name: "CHeader",
  setup() {
    return () => (
      <div class="c-header">element-ui-next</div>
    )
  }
})

export default CHeader