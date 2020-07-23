import {defineComponent, PropType} from "vue"
// import { useEventBus } from "../../menu/src/menuHooks";
// import { ElFormSymbol, ElFormItemSymbol, useGlobal } from "../../provides/index"
import eventBus from "../../../src/tools/eventBus";

const ElLink = defineComponent({
  name: "ElLink",
  props: {
    type: {
      type: String,
      default: "default"
    },
    underline: {
      type: Boolean,
      default: true
    },
    disabled: Boolean,
    href: String,
    icon: String
  },
  setup (props,  { attrs, slots }) {
    // const eventBus = useEventBus()
    const handleClick = (event) => {
      if (!props.disabled) {
        if (!props.href) {
          eventBus.emit("click", event);
        }
      }
    }
    return () => (
      <a class={[
            "el-link",
            props.type ? `el-link--${props.type}` : "",
            props.disabled && "is-disabled",
            props.underline && !props.disabled && "is-underline"
          ]}
            href={props.disabled ? "" : props.href}
            {...attrs}
            onClick={handleClick}
      >

    <i :class="icon" v-if="icon"></i>

    <span v-if="$slots.default" class="el-link--inner">
      <slot></slot>
    </span>

    <template v-if="$slots.icon"><slot v-if="$slots.icon" name="icon"></slot></template>
  </a>
    )
  }
})

export default ElLink