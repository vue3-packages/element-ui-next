import { defineComponent, onMounted, getCurrentInstance, Teleport, PropType, reactive, watch, watchEffect } from "vue"

import { usePopper, Placement } from "./usePopper"
import useClickAway from "../../../src/hooks/useClickAway"

const PopperInner = defineComponent({
  props: {
    setRootEl: {
      type: Function as PropType<(el: HTMLElement | null, popperEl: HTMLElement | null) => void>,
      required: true
    }
  },
  setup({ setRootEl }, { slots }) {
    onMounted(() => {
      const instance = getCurrentInstance()
      // let node = instance!.vnode.popperEl
      let popperEl = instance!.vnode.el
      while (popperEl && !popperEl.tagName) {
        popperEl = popperEl.nextSibling
      }
      let el = instance!.vnode.el
      while (el && !el.tagName) {
        el = el.previousElementSibling
      }
      setRootEl(el as HTMLElement | null, popperEl as HTMLElement | null)
    })
    return () => (slots.default ? slots.default() : <span></span>)
  }
})

const Popper = defineComponent({
  name: "ElPopper",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    popperClass: {
      type: String,
      default: ""
    },
    trigger: {
      type: String as PropType<"click" | "hover">,
      default: "click"
    },
    placement: {
      type: String as PropType<Placement>,
      default: "top"
    },
    modifiers: { type: Array, default: [] },
    strategy: {
      type: String as PropType<"absolute" | "fixed">,
      default: "bottom"
    }
  },
  setup(props, { attrs, slots, emit }) {
    const { state: popperState, popperEl, setReferenceEl } = usePopper(props.popperClass, {
      placement: props.placement as Placement,
      modifiers: props.modifiers,
      strategy: props.strategy as "absolute" | "fixed"
    })
    const state = reactive({
      focusPopper: false,
      visible: props.modelValue
    })
    const setVisible = (visible: boolean) => {
      if (popperState.focus && visible === false) {
      } else {
        state.visible = visible
        emit("update:modelValue", visible)
      }
    }
    watchEffect(() => {
      popperState.visible = state.visible
    })
    watch(
      () => props.modelValue,
      value => {
        state.visible = value
      }
    )

    const setRootEl = (el: HTMLElement | null, popperEl: HTMLElement | null) => {
      if (!popperEl) {
        throw new Error("reference popper dom required")
      }
      if (!el) {
        throw new Error("reference root dom required")
      }
      setReferenceEl(el, popperEl)
      if (props.trigger === "click") {
        popperEl.addEventListener("click", () => {
          setVisible(!state.visible)
        })
        useClickAway(() => {
          setVisible(false)
        }, popperEl)
      } else if (props.trigger === "hover") {
        popperEl.addEventListener("mouseenter", () => {
          setVisible(true)
        })
        popperEl.addEventListener("mouseleave", () => {
          setVisible(false)
        })
      } else if (props.trigger === "focus") {
        popperEl.addEventListener("focus", () => {
          setVisible(true)
        })
        popperEl.addEventListener("blur", () => {
          setVisible(false)
        })
      }
    }
    return () => {
      return (
        <>
          <Teleport to={`#${popperEl.id}`}>{slots.popper?.()}</Teleport>
          <PopperInner setRootEl={setRootEl}>{slots.default?.()}</PopperInner>
        </>
      )
    }
  }
})

export default Popper