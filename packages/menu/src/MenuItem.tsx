import { defineComponent, computed } from "vue";
import {useEventBus} from "./menuHooks"

const ElMenuItem = defineComponent({
  name: "ElMenuItem",
  props: {
    index: {
      default: null,
      type: String,
      required: true
    },
    disabled: Boolean,
    click: {
      type: Function
    },
    slots: {
      type: Object
    }
  },
  setup (props, {slots}) {
    const eventBus = useEventBus()
    const handleClick = () => {
      if (!props.disabled) {
        eventBus.emit("item-click", props.index);
        props.click?.()
      }
    }
    // const active = computed(() => {
    //   return props.index === this.rootMenu.activeIndex;
    // })
    const active = true
    return () => (
      <li
      role="menuitem"
      class={{
        "el-menu-item": true,
        "is-active": active,
        "is-disabled": props.disabled
      }}
      onClick={handleClick}>
        {slots.default?.()}
        {props.slots?.title?.()}
      </li>
    )
  }
})

export default ElMenuItem
