import { defineComponent, reactive, computed, watch } from "vue";

const ElSteps = defineComponent({
  name: "ElSteps",
    props: {
    space: [Number, String],
    active: Number,
    direction: {
      type: String,
      default: 'horizontal'
    },
    alignCenter: Boolean,
    simple: Boolean,
    finishStatus: {
      type: String,
      default: 'finish'
    },
    processStatus: {
      type: String,
      default: 'process'
    }
  },
  setup(props, {emit,slots}){
    const state = reactive({
      steps: [],
      stepOffset: 0
    })
    const getMigratingConfig = () => {
      return {
        props: {
          'center': 'center is removed.'
        }
      };
    }
    watch(() => props.active, (newVal, oldVal) => {
      emit('change', newVal, oldVal);
    })
    watch(() => state.steps, (steps) => {
      steps.forEach((child, index) => {
        // @ts-ignore
        child.index = index;
      });
    })
    return () => (
      <div
        class={["el-steps",!props.simple && 'el-steps--' + props.direction,
          props.simple && 'el-steps--simple']}>
        {slots.default?.()}
      </div>
    )
  }
})

export default ElSteps

