import {defineComponent,PropType,Transition} from "vue"
import {EventBus} from "../../../src/tools/eventBus"

const ELTag = defineComponent({
    name: "ELTag",
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
        default: 'light',
        }
      },
    setup(props, { attrs, slots }){
        const eventBus = new EventBus()
        const handleClose = (event) => {
            event.stopPropagation();
            eventBus.emit('close', event);
        }
        const handleClick = (event) => {
            eventBus.emit('click', event);
        }
        const { type, size, hit, effect, color, closable} = props;
        const classes = [
        'el-tag',
        type ? `el-tag--${type}` : '',
        size ? `el-tag--${size}` : '',
        effect ? `el-tag--${effect}` : '',
        hit && 'is-hit'
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
            props.disableTransitions ? tagEl : <Transition name="el-zoom-in-center">{ tagEl }</Transition>
        );
    }
})
export default ELTag;