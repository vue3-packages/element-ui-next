import { computed, defineComponent, PropType, reactive } from "vue";

const ELAvatar = defineComponent({
  name: "ElAvatar",
  props: {
    size: {
      type: [Number, String],
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
    // fit:  ,
  },
  setup(props, { attrs, slots }) {
    const state = reactive({
      isImageExist: true
    })
      
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
    const sizeStyle = typeof size === "number" ? {
      height: `${size}px`,
      width: `${size}px`,
      lineHeight: `${size}px`
    } : {};

    const handleError = () => {
      const { error } = props;
      const errorFlag = error ? error() : undefined;
      if (errorFlag !== false) {
        state.isImageExist = false;
    }
    
  }
    const renderAvatar = () => {
    const { icon, src, alt, srcSet, fit } = props;
    const {isImageExist} = state
    if (isImageExist && src) {
      return <img
        src={src}
        onError={handleError}
        alt={alt}
        srcset={srcSet}
        style={{ objectFit: fit as "-moz-initial" | "inherit" | "initial" | "revert" | "unset" | "contain" | "cover" | "fill" | "none" | "scale-down" | undefined }}/>;
    }

    if (icon) {
      return (<i class={icon} />);
    }
    return
  }
    return () => (
      <span class={avatarClass.value} style={sizeStyle}>
        {renderAvatar()}
        {slots.default?.()}
      </span>
    );
  }
})

export default ELAvatar;
