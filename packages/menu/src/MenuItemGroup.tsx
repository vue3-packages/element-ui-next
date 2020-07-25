import {defineComponent, ref, computed, inject} from "vue"
import { MenuHooks } from "./menuHooks"
import useRender from "../../../src/hooks/renderHooks"

const ElMenuItemGroup = defineComponent({
  name: "ElMenuItemGroup",
  props: {
    title: {
      type: String
    },
    slots: {
      type: Object
    }
  },
  setup (props, {slots}) {
    const root = ref(null)
    let state = inject("menuConfig") as MenuHooks
    let {render} = useRender()

    const levelPadding = computed(() => {
      if (state.rootMenu.mode === "horizontal") {
        return 10
      }
      let padding = 20;
      const dom = root.value as unknown as HTMLElement
      if (dom) {
        let parent = dom.parentElement;
        if (state.rootMenu.collapse) return 20;
        while (parent && parent.attributes["data-component"]?.nodeValue !== "ElMenu") {
          if (parent.attributes["data-component"]?.nodeValue === "ElSubmenu") {
            padding += 20;
          }
          parent = parent.parentElement;
        }
      }
      return padding
    })
    return () => (
      <li
      data-render={render.value}
      ref={root}
      class="el-menu-item-group">
        <div class="el-menu-item-group__title" style={{paddingLeft: levelPadding.value + "px"}}>
          {
            (slots.title?.() || props.slots?.title?.()) ? (slots.title?.() || props.slots?.title?.()) : props.title
          }
        </div>
        <ul>
          {slots.default?.()}
        </ul>
      </li>
    )
  }
})

export default ElMenuItemGroup