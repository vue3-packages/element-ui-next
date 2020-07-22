import {defineComponent, computed, reactive, Transition} from "vue"
import {useEventBus, useMenu} from "./menuHooks"

const ElSubMenu = defineComponent({
  name: "ElSubMenu",
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
    const {
      items
    } = useMenu("menu")

    const data = reactive({
      popperJS: null,
      timeout: null,
      submenus: {},
      mouseInChild: false
    })

    const active = computed(() => {
      let isActive = false;
      const submenus = data.submenus;
      const items = data.items;

      Object.keys(items).forEach(index => {
        if (items[index].active) {
          isActive = true;
        }
      });

      Object.keys(submenus).forEach(index => {
        if (submenus[index].active) {
          isActive = true;
        }
      });

      return isActive;
    })

    const opened = computed(() => {
      // return rootMenu.openedMenus.indexOf(props.index) > -1;
      return true;
    })

    const isMenuPopup = computed(() => {
      return false
    })

    const mode = computed(() => {
      return false
    })

    const menuTransitionName = computed(() => {
      return "el-zoom-in-left";
    })

    const handleMouseenter = (e?: DocumentEvent, num?: number) => {

    }

    const handleMouseleave = (flag?: boolean) => {

    }

    const handleClick = () => {
      eventBus.emit("submenu-click", props.index)
    }

    const handleTitleMouseenter = () => {

    }

    const handleTitleMouseleave = () => {

    }

    const popupMenu = (
      <Transition name={menuTransitionName.value}>
        <div
          ref="menu"
          v-show={opened}
          class={[`el-menu--${mode.value}`, props.popperClass]}
          on-mouseenter={($event) => handleMouseenter($event, 100)}
          on-mouseleave={() => handleMouseleave(true)}
          on-focus={($event) => handleMouseenter($event, 100)}>
          <ul
            role="menu"
            // class={["el-menu el-menu--popup", `el-menu--popup-${currentPlacement}`]}
            // style={{ backgroundColor: rootMenu.backgroundColor || "" }}
            >
            {slots.default?.()}
          </ul>
        </div>
      </Transition>
    );
    const inlineMenu = (
      <el-collapse-transition>
        <ul
          role="menu"
          class="el-menu el-menu--inline"
          v-show={opened}
          // style={{ backgroundColor: rootMenu.backgroundColor || '' }}
          >
          {slots.default?.()}
        </ul>
      </el-collapse-transition>
    );

    const submenuTitleIcon = "el-icon-arrow-down"

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
        on-mouseenter={handleMouseenter}
        on-mouseleave={() => handleMouseleave(false)}
        on-focus={handleMouseenter}
      >
        <div
          class="el-submenu__title"
          ref="submenu-title"
          on-click={handleClick}
          on-mouseenter={handleTitleMouseenter}
          on-mouseleave={handleTitleMouseleave}
          // style={[paddingStyle, titleStyle, { backgroundColor }]}
        >
          {props.slots?.title?.()}
          <i class={[ "el-submenu__icon-arrow", submenuTitleIcon ]}></i>
        </div>
        {isMenuPopup.value ? popupMenu : inlineMenu}
      </li>
    )
  }
})

export default ElSubMenu