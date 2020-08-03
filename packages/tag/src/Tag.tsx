import {defineComponent,PropType} from "vue"
import CollapseTransition from "../../Transition/CollapseTransition"


const ElTag = defineComponent({
    name: "ElTag",
    props: {
        text: String,
        closable: Boolean,
        type: String,
        hit: Boolean,
        disableTransitions: Boolean,
        color: String,
        size: String,
        effect: {
          type: String as PropType<
          "dark" | "light" | "plain" | "danger" | "info" | "text"
        >,
        default: "light",
        },
        close: Function as PropType<(event:Event) => void>,
        click: Function as PropType<(event:Event) => void>,
      },
    setup(props, { attrs, slots, emit}){
        const handleClose = (event) => {
          event.stopPropagation();
          props.close?.(event)
          emit("close",event)
        }
        const handleClick = (event) => {
          props.click?.(event)
          emit("click",event)
        }
        const { type, size, hit, effect, color, closable} = props;
        const classes = [
        "el-tag",
        type ? `el-tag--${type}` : "",
        size ? `el-tag--${size}` : "",
        effect ? `el-tag--${effect}` : "",
        hit && "is-hit"
      ];
      const tagEl = (
        <span
          class={ classes }
          style={{ backgroundColor: color }}
          onClick={ handleClick }>
          { slots.default?.() }
          {
           closable && <i class="el-tag__close el-icon-close" onClick={ handleClose }></i>
          }
        </span>
        )
        return () => (
            props.disableTransitions ? tagEl : <CollapseTransition name="el-zoom-in-center">{ tagEl }</CollapseTransition>
        );
    }
})
export default ElTag;
