import { defineComponent, computed, ref, inject, watch, getCurrentInstance, watchEffect } from "vue";
import {usePaddingStyle, MenuHooks} from "./menuHooks"
import useRender from "./../../../src/hooks/renderHooks";

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
    let state = inject("menuConfig") as MenuHooks
    const menuItem = ref(null)
    let style = usePaddingStyle(menuItem, state)
    watch(() => state.rootMenu, (val) => {
      style = usePaddingStyle(menuItem, state)
    })
    let {render} = useRender()
    
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
        state.eventBus.emit("item-click", state.items[props.index]);
        props.click?.()
      }
    }
    const onMouseEnter = (e?: MouseEvent | FocusEvent) => {
      if (state.rootMenu.mode === "horizontal" && !state.rootMenu.backgroundColor) return;
      // @ts-ignore
      menuItem?.value?.style?.backgroundColor = state.rootMenu.hoverBackground;
    }
    const onMouseLeave = (e?: MouseEvent | FocusEvent) => {
      if (state.rootMenu.mode === "horizontal" && !state.rootMenu.backgroundColor) return;
      // @ts-ignore
      menuItem?.value?.style?.backgroundColor = state.rootMenu.backgroundColor;
    }

    
    const rootMenuName = ref("")
    const menuNames = ["ElMenu", "ElMenuItem", "ElMenuItemGroup", "ElSubmenu"]
    watchEffect(() => {
      const instance = getCurrentInstance()
      let parent = instance?.parent
      while(parent && !menuNames.includes(parent?.type.name || "")) {
        parent = parent.parent
      }
      rootMenuName.value = parent?.type.name || ""
    })
    return () => (
      <li
      tabindex={-1}
      ref={menuItem}
      role="menuitem"
      data-component="ElMenuItem"
      data-render={render.value}
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
        {
          (rootMenuName.value === "ElMenu" &&
          state.rootMenu.collapse)
          ? (
            <>
              {slots.title?.() || props.slots?.title?.()}
              <div style="position: absolute;left: 0;top: 0;height: 100%;width: 100%;display: inline-block;box-sizing: border-box;padding: 0 20px;">
                {slots.default?.()}
              </div>
            </>
          )
          : <>
            {slots.default?.()}
            {slots.title?.() || props.slots?.title?.()}
          </>
        }
      </li>
    )
  }
})

export default ElMenuItem
