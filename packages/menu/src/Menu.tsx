import {defineComponent, PropType, watch, onMounted, provide, getCurrentInstance} from "vue";
import MenuCollapseTransition from "./MenuCollapseTransition"
import { useMenu } from "./menuHooks";


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
  setup(props, {slots, emit}) {
    let state = useMenu()
    const menuId = "menuConfig"
    provide(menuId, state)

    const initState = () => {
      slots.default && state.initItems(slots.default())
      state.setRootMenu({
        ...props,
        hoverBackground: props.backgroundColor ? mixColor(props.backgroundColor, 0.2) : "",
        openedMenus: (props.defaultOpeneds && !props.collapse) ? props.defaultOpeneds.slice(0) : [],
        activeIndex: state.rootMenu.activeIndex || props.defaultActive
      })
      initOpenedMenu()
      if (state.rootMenu.activeIndex) {
        state.setActive(state.items[state.rootMenu.activeIndex])
      }
    }

    const initEvents = () => {
      state.eventBus.on("item-click", handleItemClick)
      state.eventBus.on("submenu-click", handleSubmenuClick)
      state.eventBus.on("openMenu", openMenu)
      state.eventBus.on("closeMenu", closeMenu)
    }

    watch(() => props, () => {
      initState()
    }, {
      deep: true
    })

    onMounted(() => {
      initState()
      initEvents()
    })

    const getColorChannels = (color: string) => {
      color = color.replace("#", "");
      if (/^[0-9a-fA-F]{3}$/.test(color)) {
        let color_ = color.split("");
        for (let i = 2; i >= 0; i--) {
          color_.splice(i, 0, color[i]);
        }
        color = color_.join("");
      }
      if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return {
          red: parseInt(color.slice(0, 2), 16),
          green: parseInt(color.slice(2, 4), 16),
          blue: parseInt(color.slice(4, 6), 16)
        };
      } else {
        return {
          red: 255,
          green: 255,
          blue: 255
        };
      }
    }
    const mixColor = (color: string, percent: number) => {
      let { red, green, blue } = getColorChannels(color);
        if (percent > 0) { // shade given color
          red *= 1 - percent;
          green *= 1 - percent;
          blue *= 1 - percent;
        } else { // tint given color
          red += (255 - red) * percent;
          green += (255 - green) * percent;
          blue += (255 - blue) * percent;
        }
        return `rgb(${ Math.round(red) }, ${ Math.round(green) }, ${ Math.round(blue) })`;
    }

    const handleItemClick = (item) => {
      const { index, indexPath } = item;
      const hasIndex = item.index !== null;

      if (hasIndex) {
        state.rootMenu.activeIndex = item.index;
      }
      state.setActive(item);
      props.select?.(index, indexPath, item)
      emit("select", index, indexPath, item)
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
        emit("close", index, indexPath);
      } else {
        openMenu(index, indexPath);
        props.open?.(index, indexPath);
        emit("open", index, indexPath);
      }
    }

    const open = (index) => {
      const { indexPath } = state.submenus[index.toString()];
      indexPath.forEach(i => openMenu(i, indexPath));
    }
    const close = (index) => {
      closeMenu(index);
    }
    const instance = (getCurrentInstance() as any)
    instance.close = close
    instance.open = open
    const closeMenu = (index) => {
      for (let i = 0; i <= state.rootMenu.openedMenus.length - 1; i ++) {
        const menuIndex = state.rootMenu.openedMenus[i] as string
        if (
          state.submenus[menuIndex].indexPath.includes(index)
        ) {
          state.rootMenu.openedMenus.splice(i, 1);
          i --
        }
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
      state.eventBus.emit("toggle-collapse", value)
    })

    const menuComponent = () => ((
      <ul
        role="menubar"
        data-component="ElMenu"
        data-menuId={menuId}
        // key={ +(props.collapse || 0) }
        style={{ backgroundColor: props.backgroundColor || "" }}
        class={{
          "el-menu--horizontal": props.mode === "horizontal",
          "el-menu--collapse": props.collapse,
          "el-menu": true
        }}
      >
        { slots.default?.() }
      </ul>
    ))
    return props.collapseTransition ? () => (
      <MenuCollapseTransition collapse={props.collapse}>
        {menuComponent()}
      </MenuCollapseTransition>
    ) : () => menuComponent()
  }
})

export default Menu