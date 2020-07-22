import {defineComponent, computed, reactive, watch} from "vue"
import {useEventBus, useMenu, usePaddingStyle} from "./menuHooks"
import ElCollapseTransition from "../../../src/transitions/collapse-transition";

const ElSubMenu = defineComponent({
  name: "ElSubMenu",
  components: {
    ElCollapseTransition
  },
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
    const eventBus = useEventBus()
    const style = usePaddingStyle()

    const state = useMenu()

    const data = reactive({
      popperJS: null,
      timeout: null,
      mouseInChild: false
    })

    const opened = computed(() => {
      return state.rootMenu?.openedMenus?.indexOf(props.index) > -1;
    })

    const isMenuPopup = computed(() => {
      return false
    })

    const mode = computed(() => {
      return false
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

      Object.keys(_items).forEach(index => {
        if (_items[index].active) {
          isActive = true;
        }
      });

      Object.keys(_submenus).forEach(index => {
        if (_submenus[index].active) {
          isActive = true;
        }
      });

      return isActive;
    },)
    const titleStyle = computed(() => {
      if (state.rootMenu.mode !== "horizontal") {
        return {
          color: textColor.value
        };
      }
      return {
        borderBottomColor: active
          ? (state.rootMenu.activeTextColor ? activeTextColor.value : "")
          : "transparent",
        color: active
          ? activeTextColor.value
          : textColor.value
      };
    })

    const menuTransitionName = computed(() => {
      return "el-zoom-in-left";
    })

    const handleMouseenter = (e?: FocusEvent, num?: number) => {

    }

    const handleMouseleave = (flag?: boolean) => {

    }

    const handleClick = () => {
      if (
        (state.rootMenu.menuTrigger === "hover" && state.rootMenu.mode === "horizontal") ||
        (state.rootMenu.collapse && state.rootMenu.mode === "vertical") ||
        props.disabled
      ) {
        return;
      }
      eventBus.emit("submenu-click", state.submenus[props.index])
    }

    const handleTitleMouseenter = (e?: MouseEvent) => {

    }

    const handleTitleMouseleave = (e?: MouseEvent) => {

    }

    const submenuTitleIcon = (
      state.rootMenu.mode === "horizontal" ||
      state.rootMenu.mode === "vertical" && !state.rootMenu.collapse
    ) ? "el-icon-arrow-down" : "el-icon-arrow-right";

    return () => (
      <li
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
          {props.slots?.title?.()}
          <i class={[ "el-submenu__icon-arrow", submenuTitleIcon ]}></i>
        </div>
        {isMenuPopup.value ? (
          <ul
          role="menu"
          class="el-menu el-menu--inline"
          v-show={opened.value}
          style={{
            backgroundColor: state.rootMenu.backgroundColor || "",
            display: opened.value ? "block" : "none"
          }}
          >
          {slots.default?.()}
        </ul>
        ) : (
          <ul
            role="menu"
            class="el-menu el-menu--inline"
            v-show={opened.value}
            style={{
              backgroundColor: state.rootMenu.backgroundColor || "",
              display: opened.value ? "block" : "none"
            }}
            >
            {slots.default?.()}
          </ul>
        )}
      </li>
    )
  }
})

export default ElSubMenu