import {defineComponent, reactive, h, ref, onMounted, nextTick, onBeforeUnmount, StyleHTMLAttributes} from "vue"
import { addResizeListener, removeResizeListener } from "../../../src/utils/resize-event";
import scrollbarWidth from "../../../src/utils/scrollbar-width";
import { toObject } from "../../../src/utils/util";
import Bar from "./bar";

export default defineComponent({
  name: "ElScrollbar",
  props: {
    native: Boolean,
    wrapStyle: {},
    wrapClass: {},
    viewClass: {},
    viewStyle: {},
    noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
    tag: {
      type: String,
      default: "div"
    }
  },
  setup (props, {slots}) {
    const data = reactive({
      sizeWidth: "0",
      sizeHeight: "0",
      moveX: 0,
      moveY: 0
    })

    const wrapRef = ref(null)

    const handleScroll = () => {
      const wrap = wrapRef.value as unknown as HTMLElement;

      data.moveY = ((wrap.scrollTop * 100) / wrap.clientHeight);
      data.moveX = ((wrap.scrollLeft * 100) / wrap.clientWidth);
    }

    const update = () => {
      let heightPercentage, widthPercentage;
      const wrap = wrapRef.value as unknown as HTMLElement;
      if (!wrap) return;

      heightPercentage = (wrap.clientHeight * 100 / wrap.scrollHeight);
      widthPercentage = (wrap.clientWidth * 100 / wrap.scrollWidth);

      data.sizeHeight = (heightPercentage < 100) ? (heightPercentage + "%") : "";
      data.sizeWidth = (widthPercentage < 100) ? (widthPercentage + "%") : "";
    }

    const resize = ref(null)

    onMounted(() => {
      if (props.native) return;
      nextTick(update);
      !props.noresize && addResizeListener(resize.value, update);
    })

    onBeforeUnmount(() => {
      if (props.native) return;
      !props.noresize && removeResizeListener(resize.value, update);
    })

    let gutter = scrollbarWidth();
    let style = props.wrapStyle as any;

    if (gutter) {
      const gutterWith = `-${gutter}px`;
      const gutterStyle = `margin-bottom: ${gutterWith}; margin-right: ${gutterWith};`;

      if (Array.isArray(props.wrapStyle)) {
        style = toObject(props.wrapStyle);
        style.marginRight = style.marginBottom = gutterWith;
      } else if (typeof props.wrapStyle === "string") {
        style += gutterStyle;
      } else {
        style = gutterStyle;
      }
    }
    const view = h(props.tag, {
      class: ["el-scrollbar__view", props.viewClass],
      style: props.viewStyle,
      ref: resize
    }, slots.default?.());
    const wrap = (
      <div
        ref="wrap"
        style={ style }
        onScroll={ handleScroll }
        class={ [props.wrapClass, "el-scrollbar__wrap", gutter ? "" : "el-scrollbar__wrap--hidden-default"] }>
        { [view] }
      </div>
    );
    let nodes;

    if (!props.native) {
      nodes = ([
        wrap,
        <Bar
          move={ data.moveX }
          size={ data.sizeWidth }></Bar>,
        <Bar
          vertical
          move={ data.moveY }
          size={ data.sizeHeight }></Bar>
      ]);
    } else {
      nodes = ([
        <div
          ref="wrap"
          class={ [props.wrapClass, "el-scrollbar__wrap"] }
          style={ style }>
          { [view] }
        </div>
      ]);
    }
    return h("div", { class: "el-scrollbar" }, nodes);
  }
})