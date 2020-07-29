import {defineComponent, PropType ,computed, Transition} from "vue"

const ElBadge = defineComponent({
  name: "ElBadge",
  props: {
    value: [String, Number],
    max: Number,
    isDot: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    type: {
      type: String as PropType <"primary" | "success" | "warning" | "info" | "danger">
    }
  },
  setup(props, {slots}) {

    const content = computed(() => {
      if (props.isDot) return;

      const value = props.value;
      const max = props.max;

      if (typeof value === "number" && typeof max === "number") {
        return max < value ? `${max}+` : value;
      }

      return value;
    })
    return () => (
      <div class="el-badge">
      {/* <Transition name="el-zoom-in-center"> */}
       {slots.default?.()}
        {!props.hidden && (content.value || content.value === 0 || props.isDot) ? <sup
          class={["el-badge__content",
          `el-badge__content--${props.type}`,
          slots.default ? "is-fixed" : "",
          props.isDot ? "is-dot" : ""
        ]}>{content.value}
      </sup> : ""}
    {/* </Transition> */}
  </div>
    )
  }
})

export default ElBadge
