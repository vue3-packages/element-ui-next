import { defineComponent, computed, ref, onMounted } from "vue";
import {useEventBus, useMenu, usePaddingStyle, IPaddingStyle} from "./menuHooks"

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
    const state = useMenu()
    const menuItem = ref(null)
    let style = {
      paddingStyle: computed(() => {
        const paddingLeft_: IPaddingStyle = {
          paddingLeft: "0px"
        }
        return paddingLeft_
      })
    }
    onMounted(() => {
      style = usePaddingStyle(menuItem.value)
    })

    const active = computed(() => {
      return props.index === state.rootMenu.activeIndex;
    })
    const activeTextColor = computed(() => {
      return state.rootMenu.activeTextColor || "";
    })
    const textColor = computed(() => {
      return state.rootMenu.textColor || "";
    })
    const itemStyle = computed(() => {
      const style: {
        [key: string]: any
      } = {
        color: active.value ? activeTextColor.value : textColor.value
      };
      if (state.rootMenu.mode === "horizontal") {
        style.borderBottomColor = active.value
          ? (state.rootMenu.activeTextColor ? activeTextColor.value : "")
          : "transparent";
      }
      return style;
    })

    const handleClick = () => {
      if (!props.disabled) {
        eventBus.emit("item-click", state.items[props.index]);
        props.click?.()
      }
    }
    const onMouseEnter = (e?: MouseEvent | FocusEvent) => {
      if (state.rootMenu.mode === "horizontal" && !state.rootMenu.backgroundColor) return;
      menuItem?.value.style.backgroundColor = state.rootMenu.backgroundColor;
    }
    const onMouseLeave = (e?: MouseEvent | FocusEvent) => {
      if (state.rootMenu.mode === "horizontal" && !state.rootMenu.backgroundColor) return;
      menuItem?.value.style.backgroundColor = state.rootMenu.backgroundColor;
    }
    return () => (
      <li
      tabindex={-1}
      ref={menuItem}
      role="menuitem"
      class={{
        "el-menu-item": true,
        "is-active": active.value,
        "is-disabled": props.disabled
      }}
      style={{
        ...style.paddingStyle.value,
        ...itemStyle.value,
        backgroundColor: state.rootMenu.backgroundColor || ""
      }}
      onMouseenter={onMouseEnter}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      onMouseleave={onMouseLeave}
      onClick={handleClick}>
        {slots.default?.()}
        {props.slots?.title?.()}
      </li>
    )
  }
})

export default ElMenuItem
