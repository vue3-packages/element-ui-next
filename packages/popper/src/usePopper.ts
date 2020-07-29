import { reactive, computed, ref, watchEffect, onUnmounted, onMounted, InjectionKey } from "vue";
import { createPopper, Instance as Popper } from "@popperjs/core";
import { normalizeClass, createEl, removeEl } from "../../../src/utils/dom";
import { uniqueId } from "../../../src/utils/uniqueId";

import useChildren from "../../../src/hooks/useChildren";

export type Placement =
  | "auto"
  | "auto-start"
  | "auto-end"
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "right"
  | "right-start"
  | "right-end"
  | "left"
  | "left-start"
  | "left-end";

export type Strategy = "absolute" | "fixed";

const popperInject: InjectionKey<{
  id: symbol;
  visible: boolean;
}> = Symbol("popper");

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function usePopper(
  popperClass?: string | string[],
  popperOptions?: {
    trigger?: "click" | "hover" | "focus" | "manual";
    placement?: Placement;
    modifiers?: Array<any>;
    strategy?: Strategy;
  },
) {
  const { placement = "bottom", modifiers = [], strategy = "absolute" } = popperOptions || {};
  const id = uniqueId("el-popper");
  const baseClass = normalizeClass(["el-popper", popperClass]);
  let popperEl = createEl(id, baseClass);
  const popper = ref<Popper>();
  const referenceEl: HTMLElement | null = null;

  const setReferenceEl = (el: HTMLElement, popperDom: HTMLElement) => {
    if (referenceEl === popperDom) {
      return;
    }
    if (popper.value) {
      popper.value.destroy();
    }
    const container = document.querySelectorAll(`#${id}`);
    for (let i = 0; i < container.length; i++) {
      if (container[i].className === baseClass) {
        removeEl(container[i]);
      }
    }
    popperDom.className = `${popperDom.className} ${baseClass}`;
    popperDom.id = id;
    document.body.append(popperDom);
    popperEl = popperDom;
    popper.value = createPopper(el, popperDom as HTMLElement, {
      placement,
      modifiers,
      strategy,
    });
  };

  const state = reactive({
    focus: false,
    visible: false,
    childrenVisible: false,
  });

  const realVisible = computed(() => state.visible || state.focus || state.childrenVisible);

  const provideData = reactive({
    id: id,
    visible: realVisible,
  });
  useChildren(popperInject, provideData, (children) => {
    state.childrenVisible = children.some((item) => item.visible);
  });

  watchEffect(async () => {
    if (realVisible.value) {
      await popper.value?.update();
      popperEl.setAttribute("data-show", "");
    } else {
      popperEl.removeAttribute("data-show");
    }
  });

  const events: Array<[string, () => void]> = [
    ["mouseenter", () => (state.focus = true)],
    ["mouseleave", () => (state.focus = false)],
  ];

  onMounted(() => {
    events.forEach((event) => {
      popperEl.addEventListener(event[0], event[1]);
    });
  });
  onUnmounted(() => {
    if (popper.value) {
      popper.value.destroy();
      popper.value = undefined;
    }
    events.forEach((event) => {
      popperEl.removeEventListener(event[0], event[1]);
    });
    removeEl(popperEl);
  });

  return {
    popper,
    popperEl: popperEl,
    setReferenceEl,
    state: state,
  };
}
