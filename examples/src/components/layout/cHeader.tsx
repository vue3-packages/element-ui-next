import {defineComponent} from "vue"
import "./cHeader.scss"

const CHeader = defineComponent({
  name: "CHeader",
  setup() {
    return () => (
      <div class="c-header" style="text-align: left">
        element-ui-next
      </div>
    )
  }
})

export default CHeader