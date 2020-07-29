import { IEventBus, EventBus } from "../../../src/tools/eventBus";
import {
  VNode,
  VNodeNormalizedChildren,
  reactive,
  computed,
  ComputedRef,
  Ref,
  VNodeTypes,
  VNodeArrayChildren,
} from "vue";

type VNodeTypesN = VNodeTypes & { name: string };

interface IItem {
  active: boolean;
  index: string;
  indexPath: string[];
}

interface IItems {
  [key: string]: IItem;
}

interface MenuHooks {
  items: IItems;
  submenus: IItems;
  rootMenu: IRootMenu;
  initItems: (slots: VNode[], indexPath?: string[]) => void;
  setRootMenu: (rootConfig: IRootMenu) => void;
  eventBus: IEventBus;
  setActive: (item: IItem) => void;
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
  const items: IItems = {};
  const submenus: IItems = {};
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
    rootMenu,
    initItems,
    setRootMenu,
    submenus,
    eventBus,
    setActive,
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
          let _indexPath = indexPath || [];
          if (item?.props?.index) {
            _indexPath = _indexPath.concat([item?.props?.index]);
            if ((item.type as VNodeTypesN).name === "ElMenuItem") {
              state.items[item?.props?.index] = {
                index: item?.props?.index,
                indexPath: _indexPath,
                active: false,
              };
            } else if ((item.type as VNodeTypesN).name === "ElSubmenu") {
              state.submenus[item?.props?.index] = {
                index: item?.props?.index,
                indexPath: _indexPath,
                active: false,
              };
            }
          }
          if (item?.children) {
            let children: VNodeArrayChildren = [];
            if (item.children instanceof Array) {
              children = item.children;
              initItems(children, _indexPath);
            } else if (item.children instanceof Object) {
              const keys = Object.keys(item?.children);
              for (const key of keys) {
                if (key === "_") continue;
                children = children.concat((item.children as any)[key]());
              }
              initItems(children, _indexPath);
            }
          }
        }
      });
    }
  }
  function setRootMenu(rootConfig: IRootMenu): void {
    state.rootMenu = rootConfig;
  }
  function setActive(item: IItem): void {
    Object.keys(state.items).forEach((index) => {
      state.items[index].active = false;
    });
    Object.keys(state.submenus).forEach((index) => {
      state.submenus[index].active = false;
    });
    for (const index of item.indexPath) {
      if (state.items[index]) state.items[index].active = true;
      else if (state.submenus[index]) state.submenus[index].active = true;
    }
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
