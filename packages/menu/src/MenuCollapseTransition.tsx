import { defineComponent, watch, nextTick } from "vue"
import { addClass, removeClass, hasClass } from "../../../src/utils/dom"

const MenuCollapseTransitionProps = {
  onBeforeEnter(_el: Element) {
    return new Promise((resolve) => {
      const el = _el as HTMLElement
      el.style.opacity = (0.2).toString();
      resolve()
    })
  },

  onEnter(_el: Element) {
    return new Promise((resolve) => {
      const el = _el as HTMLElement
      addClass(el, "el-opacity-transition");
      el.style.opacity = (1).toString();
      resolve()
    })
  },

  onAfterEnter(_el: Element) {
    return new Promise((resolve) => {
      const el = _el as HTMLElement
      removeClass(el, "el-opacity-transition");
      setTimeout(() => {
        removeClass(el, "horizontal-collapse-transition")
      }, 300)
      el.style.opacity = "";
      resolve()
    })
  },

  onBeforeLeave(_el: Element) {
    return new Promise((resolve) => {
      const el = _el as HTMLElement
      el.style.width = ""
      if (!el.dataset) {
        // @ts-ignore
        el.dataset = {}
      };
      el.dataset.scrollWidth = el.clientWidth.toString();
      if (hasClass(el, "el-menu--collapse")) {
        removeClass(el, "el-menu--collapse");
        el.dataset.oldOverflow = el.style.overflow;
        el.dataset.beforeWidth = el.clientWidth.toString();
        addClass(el, "el-menu--collapse");
      } else {
        addClass(el, "el-menu--collapse");
        el.dataset.oldOverflow = el.style.overflow;
        el.dataset.beforeWidth = el.clientWidth.toString();
        removeClass(el, "el-menu--collapse");
      }

      el.style.width = el.dataset.beforeWidth + "px";
      el.style.overflow = "hidden";
      resolve()
    })
  },

  onLeave(_el: Element) {
    return new Promise((resolve) => {
      const el = _el as HTMLElement
      addClass(el, "horizontal-collapse-transition");
      setTimeout(() => {
        el.style.width = el.dataset.scrollWidth + "px";
        resolve()
      }, 10)
    })
  }
}

export default defineComponent({
  name: "ElCollapseTransition",
  props: {
    mode: {
      type: String,
      default: "out-in"
    },
    collapse: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { attrs, slots }) {
    watch(() => props.collapse, () => {
      const el = slots.default?.()[0].el as Element
      if (el) {
        MenuCollapseTransitionProps.onBeforeLeave(el)
        .then(() => MenuCollapseTransitionProps.onLeave(el))
        .then(() => MenuCollapseTransitionProps.onBeforeEnter(el))
        .then(() => MenuCollapseTransitionProps.onEnter(el))
        .then(() => MenuCollapseTransitionProps.onAfterEnter(el))
      }
    })
    return () => (
      <>
        {slots.default?.()}
      </>
    )
  }
})