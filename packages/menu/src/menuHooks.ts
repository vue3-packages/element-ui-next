import { IEventBus, EventBus } from "../../../src/tools/eventBus";
import { VNode, VNodeNormalizedChildren, reactive, computed, ComputedRef, Ref } from "vue";

interface IItem {
  [key: string]: any;
}

interface MenuHooks {
  items: IItem;
  submenus: IItem;
  addItem: (index: string) => void;
  rootMenu: IRootMenu;
  initItems: (slots: VNode[], indexPath?: string[]) => void;
  setRootMenu: (rootConfig: IRootMenu) => void;
  eventBus: IEventBus;
}

interface IRootMenu {
  mode: string;
  defaultActive: string;
  defaultOpeneds?: Array<string> | unknown[] | undefined;
  uniqueOpened?: boolean | undefined;
  menuTrigger: string;
  collapse?: boolean | undefined;
  backgroundColor?: string | undefined;
  textColor?: string | undefined;
  activeTextColor?: string | undefined;
  collapseTransition: boolean;
  openedMenus: unknown[];
  activeIndex: string | undefined;
  hoverBackground: string | undefined;
}

interface IPaddingStyle {
  paddingLeft?: string;
}

function useMenu(): MenuHooks {
  const items: IItem = {};
  const submenus: IItem = {};
  const rootMenu: IRootMenu = {
    mode: "vertical",
    defaultActive: "",
    defaultOpeneds: [],
    uniqueOpened: false,
    menuTrigger: "hover",
    collapse: false,
    backgroundColor: "#ffffff",
    hoverBackground: "",
    textColor: "#303133",
    activeTextColor: "#409EFF",
    collapseTransition: true,
    openedMenus: [],
    activeIndex: "",
  };
  const eventBus = new EventBus();

  const state = reactive({
    items,
    addItem,
    rootMenu,
    initItems,
    setRootMenu,
    submenus,
    eventBus,
  });

  /**
   * 初始化menu数据结构
   * @param slots 递归子节点
   * @param indexPath 节点路径
   */
  function initItems(slots: VNodeNormalizedChildren, indexPath?: string[]) {
    if (slots instanceof Array) {
      slots.forEach((item) => {
        if (item instanceof Object && !(item instanceof Array)) {
          const _indexPath = (indexPath || []).concat([item?.props?.index]);
          if (item?.props?.index) {
            state.items[item?.props?.index] = {
              index: item?.props?.index,
              indexPath: _indexPath,
              active: false,
            };
            state.submenus[item?.props?.index] = {
              index: item?.props?.index,
              indexPath: _indexPath,
              active: false,
            };
          }
          if (item?.children && item?.children instanceof Array) {
            initItems(item?.children, _indexPath);
          }
        }
      });
    }
  }
  function addItem(index: string) {
    state.items.push({
      index,
    });
  }
  function setRootMenu(rootConfig: IRootMenu): void {
    state.rootMenu = rootConfig;
  }

  return state;
}

function usePaddingStyle(
  el: Ref,
  state: MenuHooks,
): {
  paddingStyle: ComputedRef<IPaddingStyle>;
} {
  const paddingStyle = computed(() => {
    if (state.rootMenu.mode !== "vertical") return {};
    let padding = 20;
    let parent = el.value?.parentElement;
    if (state.rootMenu.collapse) {
      padding = 20;
    } else {
      while (parent && parent.attributes["data-component"]?.nodeValue !== "ElMenu") {
        if (parent.attributes["data-component"]?.nodeValue === "ElSubmenu") {
          padding += 20;
        }
        parent = parent.parentElement;
      }
    }
    return { paddingLeft: padding + "px" };
  });
  return {
    paddingStyle,
  };
}

function useMenuId(el: Ref): string {
  let parent = el.value?.parentElement;
  while (parent && parent.attributes["data-component"]?.nodeValue !== "ElMenu") {
    parent = parent.parentElement;
  }
  return parent.attributes["data-menuId"]?.nodeValue;
}

export { useMenu, MenuHooks, usePaddingStyle, IPaddingStyle, useMenuId };
