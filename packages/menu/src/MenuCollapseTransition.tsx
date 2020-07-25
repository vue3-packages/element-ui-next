import { defineComponent, Transition } from "vue"
import { addClass, removeClass, hasClass } from "../../../src/utils/dom"

const MenuCollapseTransitionProps = {
  onBeforeEnter(_el: Element) {
    const el = _el as HTMLElement
    el.style.opacity = (0.2).toString();
  },

  onEnter(_el: Element) {
    const el = _el as HTMLElement
    addClass(el, "el-opacity-transition");
    el.style.opacity = (1).toString();
  },

  onAfterEnter(_el: Element) {
    const el = _el as HTMLElement
    removeClass(el, "el-opacity-transition");
    el.style.opacity = "";
  },

  onBeforeLeave(_el: Element) {
    const el = _el as HTMLElement
    if (!el.dataset) {
      // @ts-ignore
      el.dataset = {}
    };
    if (hasClass(el, "el-menu--collapse")) {
      removeClass(el, "el-menu--collapse");
      el.dataset.oldOverflow = el.style.overflow;
      el.dataset.scrollWidth = el.clientWidth.toString();
      addClass(el, "el-menu--collapse");
    } else {
      addClass(el, "el-menu--collapse");
      el.dataset.oldOverflow = el.style.overflow;
      el.dataset.scrollWidth = el.clientWidth.toString();
      removeClass(el, "el-menu--collapse");
    }

    el.style.width = el.scrollWidth + "px";
    el.style.overflow = "hidden";
  },

  onLeave(_el: Element) {
    const el = _el as HTMLElement
    addClass(el, "horizontal-collapse-transition");
    el.style.width = el.dataset.scrollWidth + "px";
  }
}

export default defineComponent({
  name: "ElCollapseTransition",
  props: {
    mode: {
      type: String,
      default: "out-in"
    }
  },
  setup(props, { attrs, slots }) {
    return () => (
      <Transition name={props.mode} {...attrs} {...MenuCollapseTransitionProps}>
        {slots.default?.()}
      </Transition>
    )
  }
})