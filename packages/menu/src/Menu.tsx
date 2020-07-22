import {defineComponent, PropType, computed, watch, onMounted, reactive} from "vue"
import {useEventBus, useMenu} from "./menuHooks"

const Menu = defineComponent({
  name: "ElMenu",
  props: {
    mode: {
      type: String as PropType<"horizontal" | "vertical">,
      default: "vertical"
    },
    defaultActive: {
      type: String,
      default: ""
    },
    defaultOpeneds: Array,
    uniqueOpened: Boolean,
    menuTrigger: {
      type: String as PropType<"click" | "hover">,
      default: "hover"
    },
    collapse: Boolean,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String,
    collapseTransition: {
      type: Boolean,
      default: true
    },
    // function
    select: {
      type: Function
    },
    close: {
      type: Function
    },
    open: {
      type: Function
    }
  },
  setup(props, {slots}) {
    const eventBus = useEventBus()
    let state = useMenu()

    onMounted(() => {
      slots.default && state.initItems(slots.default())
      state.setRootMenu({
        ...props,
        openedMenus: (props.defaultOpeneds && !props.collapse) ? props.defaultOpeneds.slice(0) : [],
        activeIndex: props.defaultActive
      })
      initOpenedMenu()
      eventBus.on("item-click", handleItemClick)
      eventBus.on("submenu-click", handleSubmenuClick)
    })

    const handleItemClick = (item) => {
      const { index, indexPath } = item;
      const hasIndex = item.index !== null;

      if (hasIndex) {
        state.rootMenu.activeIndex = item.index;
      }
      props.select?.(index, indexPath, item)
      if (props.mode === "horizontal" || props.collapse) {
        state.rootMenu.openedMenus = [];
      }
    }
    const handleSubmenuClick = (submenu) => {
      const { index, indexPath } = submenu;
      let isOpened = state.rootMenu.openedMenus.indexOf(index) !== -1;

      if (isOpened) {
        closeMenu(index);
        props.close?.(index, indexPath);
      } else {
        openMenu(index, indexPath);
        props.open?.(index, indexPath);
      }
    }
    
    const closeMenu = (index) => {
      const i = state.rootMenu.openedMenus.indexOf(index);
      if (i !== -1) {
        state.rootMenu.openedMenus.splice(i, 1);
      }
    }
    const openMenu = (index, indexPath) => {
      let openedMenus = state.rootMenu.openedMenus;
      if (openedMenus.indexOf(index) !== -1) return;
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (props.uniqueOpened) {
        state.rootMenu.openedMenus = openedMenus.filter(index => {
          return indexPath.indexOf(index) !== -1;
        });
      }
      state.rootMenu.openedMenus.push(index);
    }
    const initOpenedMenu = () => {
      const index = state.rootMenu.activeIndex;
      const activeItem = state.items[index || ""];
      if (!activeItem || props.mode === "horizontal" || props.collapse) return;

      let indexPath = activeItem.indexPath;

      // 展开该菜单项的路径上所有子菜单
      // expand all submenus of the menu item
      indexPath.forEach(index => {
        let submenu = state.submenus[index];
        submenu && openMenu(index, submenu.indexPath);
      });
    }
    const updateActiveIndex = (val: string) => {
      const item = state.items[val] || state.items[state.rootMenu.activeIndex || ""] || state.items[props.defaultActive];
      if (item) {
        state.rootMenu.activeIndex = item.index;
        initOpenedMenu();
      } else {
        state.rootMenu.activeIndex = "";
      }
    }
    watch(() => props.defaultActive, (value) => {
      if(!state.items[value]){
        state.rootMenu.activeIndex = ""
      }
      updateActiveIndex(value)
    })

    watch(() => props.defaultOpeneds, (value) => {
      if (!props.collapse && value) {
        state.rootMenu.openedMenus = value;
      }
    })

    watch(() => props.collapse, (value) => {
      if (value) state.rootMenu.openedMenus = [];
      // broadcast('ElSubmenu', 'toggle-collapse', value);
    })

    // watch(() => data.items, (val) => {
    //   updateActiveIndex(val)
    // })

    return () => (
      <ul
        role="menubar"
        key={ +(props.collapse || 0) }
        style={{ backgroundColor: props.backgroundColor || "" }}
        class={{
          "el-menu--horizontal": props.mode === "horizontal",
          "el-menu--collapse": props.collapse,
          "el-menu": true
        }}
      >
        { slots.default?.() }
      </ul>
    )
  }
})

export default Menu