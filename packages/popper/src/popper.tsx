import { defineComponent, onMounted, getCurrentInstance, Teleport, PropType, reactive, watch, watchEffect, onBeforeUnmount, nextTick } from "vue"
import { usePopper, Placement } from "./usePopper"
import useClickAway from "../../../src/hooks/useClickAway"
import { addClass, removeClass } from "../../../src/utils/dom"

class PopperTransitionOpt {
  name = ""
  el: HTMLElement = document.createElement("div")
  constructor (name: string) {
    this.name = name
  }

  setEl (el: HTMLElement) {
    this.el = el
  }

  onBeforeEnter() {
    return new Promise(resolve => {
      addClass(this.el, `${this.name}-enter`)
      resolve(this)
    })
  }

  onEnter() {
    return new Promise(resolve => {
      removeClass(this.el, `${this.name}-enter`)
      addClass(this.el, `${this.name}-enter-active`)
      resolve(this)
    })
  }

  onAfterEnter() {
    return new Promise(resolve => {
      removeClass(this.el, `${this.name}-enter-active`)
      addClass(this.el, `${this.name}-enter-to`)
      resolve(this)
    })
  }

  onBeforeLeave() {
    return new Promise(resolve => {
      removeClass(this.el, `${this.name}-enter-to`)
      addClass(this.el, `${this.name}-leave`)
      resolve(this)
    })
  }

  onLeave() {
    return new Promise(resolve => {
      removeClass(this.el, `${this.name}-leave`)
      addClass(this.el, `${this.name}-leave-active`)
      resolve(this)
    })
  }

  onAfterLeave() {
    return new Promise(resolve => {
      removeClass(this.el, `${this.name}-leave-active`)
      addClass(this.el, `${this.name}-leave-to`)
      resolve(this)
    })
  }
}

const PopperInner = defineComponent({
  props: {
    setRootEl: {
      type: Function as PropType<(el: HTMLElement | null, popperEl: HTMLElement | null) => void>,
      required: true
    },
    name: {
      type: String
    }
  },
  setup({ setRootEl, name }, { slots }) {
    let transitionObj: PopperTransitionOpt = new PopperTransitionOpt(name || "")
    onMounted(() => {
      const instance = getCurrentInstance()
      let popperEl = instance!.vnode.el
      while (popperEl && !popperEl.tagName) {
        popperEl = popperEl.nextSibling
      }
      let el = instance!.vnode.el
      while (el && !el.tagName) {
        el = el.previousElementSibling
      }
      transitionObj.setEl(popperEl as HTMLElement)
      transitionObj.onBeforeEnter()
      .then(obj => {
        return (obj as PopperTransitionOpt).onEnter()
      }).then(obj => {
        return (obj as PopperTransitionOpt).onAfterEnter()
      })
      setRootEl(el as HTMLElement | null, popperEl as HTMLElement | null)
    })
    onBeforeUnmount(() => {
      transitionObj.onBeforeLeave().then(obj => {
        return (obj as PopperTransitionOpt).onLeave()
      }).then(obj => {
        return (obj as PopperTransitionOpt).onAfterLeave()
      })
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
    },
    name: {
      type: String
    },
    transitionName: {
      type: String
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
          <PopperInner name={props.transitionName} setRootEl={setRootEl}>
            {slots.default?.()}
          </PopperInner>
        </>
      )
    }
  }
})

export default Popper