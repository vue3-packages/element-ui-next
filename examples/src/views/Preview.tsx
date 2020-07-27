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
  setup(props, { slots, attrs }) {
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
          <div class="preview__demo source">
            <div>{slots.demo?.()}</div>
          </div>
          <div style={{ height: `${state.codeHeight}px` }} class="preview__code meta">
            <div ref={codeRef} class="preview__coderef">
              {
                slots.description && (
                  <div class="preview__description description">
                    {slots.description?.()}
                  </div>
                )
              }
              <pre class="preview__coder highlight">
                <code class="language-markup">{props.source}</code>
              </pre>
            </div>
          </div>
          <div class="preview__footer demo-block-control" onClick={toggleCode}>
            { state.codeHeight > 0 ? "隐藏代码" : "显示代码" }
          </div>
        </div>
      </div>
    )
  }
})