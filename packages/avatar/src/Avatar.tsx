import { inject, computed, defineComponent, PropType } from "vue";

const Avatar = defineComponent({
  name: "ElAvatar",
  props: {
    size: {
      type: [Number, String],
      validator(val) {
        if (typeof val === "string") {
          return ["large", "medium", "small"].includes(val);
        }
        return typeof val === "number";
      }
    },
    shape: {
      type: String as PropType<
        "circle" | "square"
        >,
      default: "circle"
    },
    icon: { type: String, default: "" },
    src: { type: String, default: "" },
    alt: { type: String, default: "" },
    srcSet: { type: String, default: "" },
    error: Function,
    fit: { type: String, default: "cover" }
  },
  setup(props, { attrs, slots }) {
    // const elForm = inject(ElFormSymbol, null)
    // const elFormItem = inject(ElFormItemSymbol, null)
    // const elGlobalConfig = useGlobal()
    // const buttonSize = computed(() => {
    //   return props.size || elFormItem?.elFormItemSize || elGlobalConfig?.size
    // })
    // const buttonDisabled = computed(() => {
    //   return props.disabled || elForm?.disabled
    // })
    const { size, icon, shape } = props;
    const avatarClass = computed(() => {
      let classList = ["el-avatar"];

      if (size && typeof size === "string") {
        classList.push(`el-avatar--${size}`);
      }

      if (icon) {
        classList.push("el-avatar--icon");
      }

      if (shape) {
        classList.push(`el-avatar--${shape}`);
      }

      return classList.join(" ");
    })

    const sizeStyle = computed(() => {
      typeof size === "number" ? {
        height: `${size}px`,
        width: `${size}px`,
        lineHeight: `${size}px`
      } : {};
    })
    return () => (
      <span class={avatarClass} style={sizeStyle}>
        {
          this.renderAvatar()
        }
      </span>
    );
  }
});

export default Avatar;
