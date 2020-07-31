{/* <script>
  export default {
    name: 'ElTimeline',

    props: {
      reverse: {
        type: Boolean,
        default: false
      }
    },

    provide() {
      return {
        timeline: this
      };
    },

    render() {
      const reverse = this.reverse;
      const classes = {
        'el-timeline': true,
        'is-reverse': reverse
      };
      let slots = this.$slots.default || [];
      if (reverse) {
        slots = slots.reverse();
      }
      return (<ul class={ classes }>
        { slots }
      </ul>);
    }
  };
</script> */}
import {defineComponent} from "vue";

const ElTimeline = defineComponent({
  name: "ElTimeline",
  props: {
    reverse: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots}){
    const provide = () =>{
      return {
        timeline: this
      }
    }
    const classes = {
      "el-timeline": true,
      is-reverse: props.reverse
    },
    const slots = slots.default || []
    return() => (
      if (reverse) {
        slots = slots.reverse();
      }
      (<ul class={ classes }>
        { slots }
      </ul>);
    )
  }
})
export default ElTimeline
