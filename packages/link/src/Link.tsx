import {defineComponent, PropType} from "vue"
// import { ElFormSymbol, ElFormItemSymbol, useGlobal } from "../../provides/index"

const ElLink = defineComponent({
  name: "ElLink",
  props: {
    type: {
        type: String as PropType<
        "primary" | "success" | "warning" | "danger" | "info"
        >,
        default: "default"
      },
    icon: { type: String, default: "" },
    underline: { type: Boolean },
    disabled: { type: Boolean }
  },
  setup (props,  { attrs, slots }) {
    // const elForm = inject(ElFormSymbol, null)
    // const linkUnderline = computed(() => {
    //     return props.underline || elForm?.underline
    //   })
    return () => (
      <a
        class={[
          "el-link",
          `el-link--${props.type}`,
          {
            "is-underline": props.underline,
            "is-disabled": props.disabled,
          }
      ]}
      {...attrs}
      > 
      {props.icon && <i class={props.icon}></i>}
        <span class='el-link--inner'></span>
      </a>
    )
  }
})

export default ElLink