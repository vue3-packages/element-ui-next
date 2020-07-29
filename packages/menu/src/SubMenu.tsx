import {defineComponent,getCurrentInstance, computed, ref, onMounted, onBeforeMount, inject, watchEffect} from "vue"
import {usePaddingStyle, MenuHooks} from "./menuHooks"
import CollapseTransition from "../../Transition/CollapseTransition"
import ElPopper from "../../popper/index"
import useRender from "../../../src/hooks/renderHooks"

const ElSubmenu = defineComponent({
  name: "ElSubmenu",
  props: {
    index: {
      type: String,
      required: true
    },
    showTimeout: {
      type: Number,
      default: 300
    },
    hideTimeout: {
      type: Number,
      default: 300
    },
    popperClass: String,
    disabled: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: undefined
    },
    slots: {
      type: Object,
    }
  },
  setup (props, {slots}) {
    const root = ref(null)
    let state = inject("menuConfig") as MenuHooks
    let {render} = useRender()
    let style = usePaddingStyle(root, state)
    const instance = getCurrentInstance()

    onMounted(() => {
      style = usePaddingStyle(root, state)
    })

    const opened = computed(() => {
      return state.rootMenu?.openedMenus?.indexOf(props.index) > -1;
    })

    const isMenuPopup = computed(() => {
      return state.rootMenu.mode === "horizontal" || (state.rootMenu.mode === "vertical" && state.rootMenu.collapse);
    })

    const activeTextColor = computed(() => {
      return state.rootMenu.activeTextColor || "";
    })
    const backgroundColor = computed(() => {
      return state.rootMenu.backgroundColor || "";
    })
    const textColor = computed(() => {
      return state.rootMenu.textColor || "";
    })
    const active = computed(() => {
      let isActive = false;
      const _submenus = state.submenus;
      const _items = state.items;
      if (_items[props.index]?.active) {
        isActive = true;
      }

      if (_submenus[props.index]?.active) {
        isActive = true;
      }

      return isActive;
    },)
    const titleStyle = computed(() => {
      if (state.rootMenu.mode !== "horizontal") {
        return {
          color: textColor.value
        };
      }
      return {
        borderBottomColor: active.value
          ? (state.rootMenu.activeTextColor ? activeTextColor.value : "")
          : "transparent",
        color: active.value
          ? activeTextColor.value
          : textColor.value
      };
    })

    const menuTransitionName = computed(() => {
      return state.rootMenu.collapse ? "el-zoom-in-left" : "el-zoom-in-top";
    })

    let timeout: number | undefined = undefined
    const appendToBody = computed(() => {
      return props.popperAppendToBody === undefined
        ? isFirstLevel.value
        : props.popperAppendToBody;
    })
    const mouseInChild = ref(false)
    state.eventBus.on("mouse-enter-child", () => {
      mouseInChild.value = true
      clearTimeout(timeout);
    })
    state.eventBus.on("mouse-leave-child", () => {
      mouseInChild.value = false
      clearTimeout(timeout);
    })
    const handleMouseenter = (event: FocusEvent, num?: number) => {
      if (!("ActiveXObject" in window) && event.type === "focus" && !event.relatedTarget) {
        return;
      }
      if (
        (state.rootMenu.menuTrigger === "click" && state.rootMenu.mode === "horizontal") ||
        (!state.rootMenu.collapse && state.rootMenu.mode === "vertical") ||
        props.disabled
      ) {
        return;
      }
      state.eventBus.emit("mouse-enter-child")
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        state.eventBus.emit("openMenu", props.index, state.submenus[props.index].indexPath)
      }, props.showTimeout);

      if (appendToBody.value) {
        (root.value as unknown as HTMLElement)?.parentElement?.dispatchEvent(new MouseEvent("mouseenter"));
      }
    }
    const handleMouseleave = (deepDispatch?: boolean) => {
      if (
        (state.rootMenu.menuTrigger === "click" && state.rootMenu.mode === "horizontal") ||
        (!state.rootMenu.collapse && state.rootMenu.mode === "vertical")
      ) {
        return;
      }
      state.eventBus.emit("mouse-leave-child")
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!mouseInChild.value) {
          state.eventBus.emit("closeMenu", props.index)
        }
      }, props.hideTimeout);
      if (deepDispatch) {
        let parent = instance?.parent
        while(parent && parent.type.name !== "ElMenu") {
          if (parent?.type.name === "ElSubmenu") {
            // @ts-ignore
            parent.handleMouseleave(true)
            break;
          } else {
            parent = parent.parent
          }
        }
      }
    }
    // @ts-ignore
    instance?.handleMouseleave = handleMouseleave
    const handleClick = () => {
      if (
        (state.rootMenu.menuTrigger === "hover" && state.rootMenu.mode === "horizontal") ||
        (state.rootMenu.collapse && state.rootMenu.mode === "vertical") ||
        props.disabled
      ) {
        return;
      }
      state.eventBus.emit("submenu-click", state.submenus[props.index])
    }

    const handleTitleMouseenter = (e?: MouseEvent) => {
      
    }

    const handleTitleMouseleave = (e?: MouseEvent) => {
      
    }

    const submenuTitleIcon = computed(() => {
      return (
        state.rootMenu.mode === "horizontal" && isFirstLevel.value ||
        state.rootMenu.mode === "vertical" && !state.rootMenu.collapse
      ) ? "el-icon-arrow-down" : "el-icon-arrow-right postion_ab"
    })
    
    
    const menu = ref(null)
    const isFirstLevel = computed(() => {
      let isFirstLevel = true;
      let parent = instance?.parent;
      while (parent && parent.type.name !== "ElMenu") {
        if (["ElSubmenu", "ElMenuItemGroup"].indexOf(parent.type.name || "") > -1) {
          isFirstLevel = false;
          break;
        } else {
          parent = parent.parent;
        }
      }
      return isFirstLevel;
    })
    let currentPlacement = ref("bottom-start")
    watchEffect(() => {
      currentPlacement.value = state.rootMenu.mode === "horizontal" && isFirstLevel.value
      ? "bottom-start"
      : "right-start";
    })

    const updatePlacement = () => {
      currentPlacement.value = state.rootMenu.mode === "horizontal" && isFirstLevel.value
        ? "bottom-start"
        : "right-start";
    }
    const initPopper = (el: HTMLElement) => {
      updatePlacement();
    }
    const handleCollapseToggle = (value) => {
      if (value) {
        initPopper(menu.value as unknown as HTMLElement);
      } else {
        // doDestroy();
      }
    }
    onBeforeMount(() => {
      state.eventBus.on("toggle-collapse", handleCollapseToggle)
    })
    onMounted(() => {
      initPopper(menu.value as unknown as HTMLElement)
    })
    return () => (
      <li
        ref={root}
        data-component="ElSubmenu"
        class={{
          "el-submenu": true,
          "is-active": active.value,
          "is-opened": opened.value,
          "is-disabled": props.disabled
        }}
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={opened.value}
        onMouseenter={handleMouseenter}
        onMouseleave={() => handleMouseleave(false)}
        onFocus={handleMouseenter}
      >
        <div
          data-render={render.value}
          class="el-submenu__title"
          ref="submenu-title"
          onClick={handleClick}
          onMouseenter={handleTitleMouseenter}
          onMouseleave={handleTitleMouseleave}
          style={{ 
            ...style.paddingStyle.value,
            ...titleStyle.value,
            backgroundColor: backgroundColor.value
          }}
        >
          {slots.title?.() || props.slots?.title?.()}
          <i class={[ "el-submenu__icon-arrow", submenuTitleIcon.value ]}></i>
        </div>
        {isMenuPopup.value ? (
            opened.value ? (
              <ElPopper
              transitionName="tb"
              name={menuTransitionName.value}
              placement={currentPlacement.value}>
                <div
                  ref={menu}
                  class={[`el-menu--${state.rootMenu.mode}`, props.popperClass]}
                  onMouseenter={($event) => handleMouseenter($event, 100)}
                  onMouseleave={() => handleMouseleave(true)}
                  onFocus={($event) => handleMouseenter($event, 100)}>
                  <ul
                    role="menu"
                    class={["el-menu el-menu--popup", `el-menu--popup-${currentPlacement.value}`]}
                    style={{ backgroundColor: state.rootMenu.backgroundColor || "" }}>
                    {slots.default?.()}
                  </ul>
                </div>
              </ElPopper>
            ) : (<div></div>)
        ) : (
          <CollapseTransition name={menuTransitionName.value}>
            {opened.value ? (
              <ul
                role="menu"
                class="el-menu el-menu--inline"
                style={{
                  backgroundColor: state.rootMenu.backgroundColor || ""
                }}
                >
                {slots.default?.()}
              </ul>) : ""}
          </CollapseTransition>
        )}
      </li>
    )
  }
})

export default ElSubmenu