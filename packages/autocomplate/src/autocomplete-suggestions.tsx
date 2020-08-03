import {defineComponent, reactive, getCurrentInstance, inject, onUpdated, nextTick, onMounted} from "vue"
import Prpper from "../../popper/index"
import {IEventBus} from "../../../src/tools/eventBus"
import Popper from "../../popper/src/popper";
import ElScrollbar from "../../scrollbar/index"

export default defineComponent({
  name: "ElAutocompleteSuggestions",
  props: {
    options: {
      default() {
        return {
          gpuAcceleration: false
        };
      }
    },
    id: String
  },
  setup(props, {slots}) {
    const instance = getCurrentInstance()
    const eventBus: IEventBus | undefined = inject("autocomplete_eventBus")
    const data = reactive({
      parent: instance?.parent,
      dropdownWidth: "",
      showPopper: false
    })
    eventBus?.on("ElAutocompleteSuggestions_visible", (val, inputWidth) => {
      data.dropdownWidth = inputWidth + "px";
      data.showPopper = val as boolean;
    })

    const select = (item) => {
      eventBus?.emit("ElAutocomplete_item-click", item)
    }
    onMounted(() => {
      // this.$parent.popperElm = this.popperElm = this.$el;
      // this.referenceElm = this.$parent.$refs.input.$refs.input || this.$parent.$refs.input.$refs.textarea;
      // this.referenceList = this.$el.querySelector(".el-autocomplete-suggestion__list");
      // this.referenceList.setAttribute("role", "listbox");
      // this.referenceList.setAttribute("id", this.id);
    })

    return () => (
      <Popper>
        {
          data.showPopper ? (
            <div
              class={{
                "el-autocomplete-suggestion": true,
                "el-popper": true,
                "is-loading": !(data.parent as any)?.hideLoading && (data.parent as any)?.loading
              }}
              style={{ width: data.dropdownWidth }}
              role="region">
              <ElScrollbar
              tag="ul"
              wrap-class="el-autocomplete-suggestion__wrap"
              view-class="el-autocomplete-suggestion__list">
                {
                  !(data.parent as any)?.hideLoading && (data.parent as any)?.loading ? (
                    <li><i class="el-icon-loading"></i></li>
                  ) : slots.default?.()
                }
              </ElScrollbar>
            </div>
          ) : ""
        }
      </Popper>
    )
  }
})