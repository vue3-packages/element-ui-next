import {defineComponent, PropType, computed, reactive, watch, onMounted} from "vue"
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
  setup(props, {emit, slots}) {
    const eventBus = useEventBus()
    const {
      items
    } = useMenu("menu")
    onMounted(() => {
      initOpenedMenu()
      eventBus.on("item-click", handleItemClick)
      eventBus.on("submenu-click", handleSubmenuClick)
    })

    const data = reactive({
      activeIndex: props.defaultActive,
      openedMenus: (props.defaultOpeneds && !props.collapse) ? props.defaultOpeneds.slice(0) : [],
      submenus: {}
    })
    const handleItemClick = (item) => {
      const { index, indexPath } = item;
      const hasIndex = item.index !== null;

      if (hasIndex) {
        data.activeIndex = item.index;
      }
      props.select?.(index, indexPath, item)
      if (props.mode === "horizontal" || props.collapse) {
        data.openedMenus = [];
      }
    }
    const handleSubmenuClick = (submenu) => {
      const { index, indexPath } = submenu;
      let isOpened = data.openedMenus.indexOf(index) !== -1;

      if (isOpened) {
        closeMenu(index);
        props.close?.(index, indexPath);
      } else {
        openMenu(index, indexPath);
        props.open?.(index, indexPath);
      }
    }
    
    const closeMenu = (index) => {
      const i = data.openedMenus.indexOf(index);
      if (i !== -1) {
        data.openedMenus.splice(i, 1);
      }
    }
    const openMenu = (index, indexPath) => {
      let openedMenus = data.openedMenus;
      if (openedMenus.indexOf(index) !== -1) return;
      // 将不在该菜单路径下的其余菜单收起
      // collapse all menu that are not under current menu item
      if (props.uniqueOpened) {
        data.openedMenus = openedMenus.filter(index => {
          return indexPath.indexOf(index) !== -1;
        });
      }
      data.openedMenus.push(index);
    }
    const initOpenedMenu = () => {
      const index = data.activeIndex;
      const activeItem = items[index];
      if (!activeItem || props.mode === "horizontal" || props.collapse) return;

      let indexPath = activeItem.indexPath;

      // 展开该菜单项的路径上所有子菜单
      // expand all submenus of the menu item
      indexPath.forEach(index => {
        let submenu = data.submenus[index];
        submenu && openMenu(index, submenu.indexPath);
      });
    }
    const updateActiveIndex = (val: string) => {
      const item = items[val] || items[data.activeIndex] || items[props.defaultActive];
      if (item) {
        data.activeIndex = item.index;
        initOpenedMenu();
      } else {
        data.activeIndex = "";
      }
    }
    watch(() => props.defaultActive, (value) => {
      if(!items[value]){
        data.activeIndex = ""
      }
      updateActiveIndex(value)
    })

    watch(() => props.defaultOpeneds, (value) => {
      if (!props.collapse && value) {
        data.openedMenus = value;
      }
    })

    watch(() => props.collapse, (value) => {
      if (value) data.openedMenus = [];
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