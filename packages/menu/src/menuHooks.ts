import eventBus, { IEventBus } from "../../../src/tools/eventBus";
import { VNode, VNodeNormalizedChildren, reactive, computed, ComputedRef } from "vue";

function useEventBus(): IEventBus {
  return eventBus;
}

interface IItem {
  [key: string]: unknown;
}

interface MenuHooks {
  items: IItem[];
  addItem: (index: string) => void;
  rootMenu: IRootMenu;
  initItems: (slots: VNode[], indexPath?: string[]) => void;
  setRootMenu: (rootConfig: IRootMenu) => void;
  submenus: IItem[];
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
}

const items: IItem[] = [];
const submenus: IItem[] = [];
const rootMenu: IRootMenu = {
  mode: "vertical",
  defaultActive: "",
  defaultOpeneds: [],
  uniqueOpened: false,
  menuTrigger: "hover",
  collapse: false,
  backgroundColor: "#ffffff",
  textColor: "#303133",
  activeTextColor: "#409EFF",
  collapseTransition: true,
  openedMenus: [],
  activeIndex: "",
};

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
interface IPaddingStyle {
  paddingLeft?: string;
}

const state = reactive({
  items,
  addItem,
  rootMenu,
  initItems,
  setRootMenu,
  submenus,
});

function useMenu(): MenuHooks {
  return state;
}

function usePaddingStyle(
  el: null | HTMLElement,
): {
  paddingStyle: ComputedRef<IPaddingStyle>;
} {
  const paddingStyle = computed(() => {
    if (state.rootMenu.mode !== "vertical") return {};
    let padding = 20;
    let parent = el?.parentElement;

    if (state.rootMenu.collapse) {
      padding = 20;
    } else {
      while (parent && parent.attributes["role"].nodeValue !== "menubar") {
        if (parent.attributes["role"].nodeValue !== "menu") {
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

export { useEventBus, useMenu, MenuHooks, usePaddingStyle, IPaddingStyle };
