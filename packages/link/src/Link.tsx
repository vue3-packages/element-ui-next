import { defineComponent} from "vue";
// import { useEventBus } from "../../menu/src/menuHooks";
// import { ElFormSymbol, ElFormItemSymbol, useGlobal } from "../../provides/index"
import {EventBus} from "../../../src/tools/eventBus";

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
  setup(props, { attrs, slots }) {
    const eventBus = new EventBus()
    const handleClick = (event) => {
      if (!props.disabled) {
        if (!props.href) {
          eventBus.emit("click", event);
        }
      }
    };
    return () => (
      <a class={[
        "el-link",
        props.type ? `el-link--${props.type}` : "",
        props.disabled && "is-disabled",
        props.underline && !props.disabled && "is-underline"
      ]}
         href={props.disabled ? null : props.href}
         {...attrs}
         onClick={handleClick}
      >

        {props.icon && <i class={props.icon}></i>}
        {slots.default && <span class="el-link--inner">{slots.default?.(`name:${props.icon}`)}</span>}
        <span v-if="$slots.default" class="el-link--inner">
        <slot></slot>
       </span>
        {slots.icon && slots.default?.(`name:${props.icon}`)}
        {/*<template v-if="$slots.icon"><slot v-if="$slots.icon" name="icon"></slot></template>*/}
      </a>
    );
  }
});

export default ElLink;