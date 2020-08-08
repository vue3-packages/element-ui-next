import { defineComponent, provide, getCurrentInstance, onMounted} from "vue";

const ElBreadcrumb = defineComponent({
  name: "ElBreadcrumb",
  props: {
    separator: {
      type: String,
      default: "/"
    },
    separatorClass: {
      type: String,
      default: ""
    }
  },
  setup(props, {slots}){
    const instance = getCurrentInstance()
    provide("elBreadcrumb", instance)
    const $el = instance?.vnode.el as HTMLElement
    onMounted(() => {
      const items = $el.querySelectorAll(".el-breadcrumb__item");
      if (items.length) {
        items[items.length - 1].setAttribute("aria-current", "page");
      }
    })
    return () => (
      <div class="el-breadcrumb" aria-label="Breadcrumb" role="navigation">
        {slots.default?.()}
    </div>
    )
  }
})
export default ElBreadcrumb
