import {defineComponent, provide, getCurrentInstance} from "vue";

const ElTimeline = defineComponent({
  name: "ElTimeline",
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },
  setup: function(props, { slots }) {
    const timeline = getCurrentInstance();
    // const provide = () =>{
    //   return {
    //     timeline: this
    //   }
    // }
    provide("timeline", timeline);
    const reverse = props.reverse;
    const classes = {
      "el-timeline": true,
      "is-reverse": props.reverse
    };
    const sl = slots.default?.() || []
    if (reverse) {
      if(sl.length <= 1) { // 使用数组渲染slots.default?.()只有一个元素，内容在children里面
        sl?.reverse()
        sl.forEach(v => {
          // @ts-ignore
          v.children?.reverse()
        })
      } else {
        sl?.reverse() // 不使用数组渲染slots.default?.()只有一个元素，内容在slots.default?.()里面
      }

    }
    return () => (
      <ul class={classes}>
        {/*{reverse ? sl?.reverse() : sl}*/}
        {/*{slots.default?.()}*/}
        {sl}
      </ul>
    );
  }
})
// @ts-ignore
export default ElTimeline
