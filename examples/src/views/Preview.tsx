import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  nextTick
} from "vue"
import "./Preview.scss"

export default defineComponent({
  name: "Preview",
  props: {
    source: {
      type: String,
      default: ""
    }
  },
  setup(props, { slots }) {
    const codeRef = ref<HTMLDivElement>()
    const state = reactive({
      codeHeight: 0
    })
    const highlightAll = () => {
      nextTick(() => {
        (window as any).Prism.highlightAll()
      })
    }
    const toggleCode = () => {
      if (state.codeHeight === 0) {
        state.codeHeight = codeRef.value?.offsetHeight || 0
      } else {
        state.codeHeight = 0
      }
    }
    onMounted(() => {
      highlightAll()
    })
    return () => (
      <div class="preview">
        <div class="preview__card">
          <div class="preview__demo">
            {slots.demo?.()}
          </div>
          <div style={{ height: `${state.codeHeight}px` }} class="preview__code">
            <div ref={codeRef} class="preview__coderef">
              <pre>
                <code class="language-markup">{props.source}</code>
              </pre>
            </div>
          </div>
          <div class="preview__footer" onClick={toggleCode}>
            { state.codeHeight > 0 ? "隐藏代码" : "显示代码" }
          </div>
        </div>
      </div>
    )
  }
})