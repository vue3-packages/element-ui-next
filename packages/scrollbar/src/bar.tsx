import {defineComponent, computed, getCurrentInstance, ref} from "vue"
import { on, off } from "../../../src/utils/dom";
import { renderThumbStyle, BAR_MAP } from "./util";

export default defineComponent({
  name: "Bar",
  props: {
    vertical: Boolean,
    size: String,
    move: Number
  },
  setup (props, {}) {
    const instance = getCurrentInstance() as any
    const bar = computed(() => {
      return BAR_MAP[props.vertical ? "vertical" : "horizontal"];
    })
    const wrap = computed(() => {
      return (instance?.parent as any)?.wrap;
    })

    const thumb = ref(null)
    const clickTrackHandler = (e) => {
      const offset = Math.abs(e.target.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]);
      // @ts-ignore
      const thumbHalf = (thumb.value?.[bar.value.offset] / 2);
      const thumbPositionPercentage = ((offset - thumbHalf) * 100 / instance?.vnode.el?.[bar.value.offset]);

      wrap.value[bar.value.scroll] = (thumbPositionPercentage * wrap.value[bar.value.scrollSize] / 100);
    }
    const mouseMoveDocumentHandler = (e) => {
      if (instance.cursorDown === false) return;
      const prevPage = this[bar.value.axis];

      if (!prevPage) return;

      const offset = ((instance?.vnode.el.getBoundingClientRect()[bar.value.direction] - e[bar.value.client]) * -1);
      // @ts-ignore
      const thumbClickPosition = (thumb.value[bar.value.offset] - prevPage);
      const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / instance?.vnode.el[bar.value.offset]);

      wrap.value[bar.value.scroll] = (thumbPositionPercentage * wrap.value[bar.value.scrollSize] / 100);
    }

    const mouseUpDocumentHandler = (e) => {
      instance.cursorDown = false;
      this[bar.value.axis] = 0;
      off(document, "mousemove", mouseMoveDocumentHandler);
      document.onselectstart = null;
    }
    const startDrag = (e) => {
      e.stopImmediatePropagation();
      instance.cursorDown = true;

      on(document, "mousemove", mouseMoveDocumentHandler);
      on(document, "mouseup", mouseUpDocumentHandler);
      document.onselectstart = () => false;
    }
    const clickThumbHandler = (e) => {
      // prevent click event of right button
      if (e.ctrlKey || e.button === 2) {
        return;
      }
      startDrag(e);
      this[bar.value.axis] = (e.currentTarget[bar.value.offset] - (e[bar.value.client] - e.currentTarget.getBoundingClientRect()[bar.value.direction]));
    }
    return () => (
      <div
        class={ ["el-scrollbar__bar", "is-" + bar.value.key] }
        onMousedown={ clickTrackHandler } >
        <div
          ref={thumb}
          class="el-scrollbar__thumb"
          onMousedown={ clickThumbHandler }
          style={ renderThumbStyle({ size: props.size, move: props.move, bar: bar.value }) }>
        </div>
      </div>
    )
  }
})