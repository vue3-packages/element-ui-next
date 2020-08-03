import { defineComponent } from "vue";

const ElTimelineItem = defineComponent({
  name: "ElTimelineItem",
  props: {
    timestamp: String,

    hideTimestamp: {
      type: Boolean,
      default: false
    },

    placement: {
      type: String,
      default: "bottom"
    },

    type: String,

    color: String,

    size: {
      type: String,
      default: "normal"
    },
    icon: String
  },
  setup(props, {slots}) {
    // const state = inject("timeline");
    return () => (
      <li class="el-timeline-item">
        <div class="el-timeline-item__tail"></div>

        {!slots.dot ? <div
             class={["el-timeline-item__node",
               `el-timeline-item__node--${props.size || ''}`,
               `el-timeline-item__node--${props.type || ''}`
             ]}
              style={{backgroundColor: props.color}}>
          {props.icon ? <i class={["el-timeline-item__icon",props.icon]}></i> : ""}
        </div> : ""}
        {slots.dot ? <div class="el-timeline-item__dot">
          <slot name="dot">
            {slots.dot?.()}</slot>
        </div> : ""}

        <div class="el-timeline-item__wrapper">
          {!props.hideTimestamp &&props.placement === 'top' ?
            <div class="el-timeline-item__timestamp is-top">
            {props.timestamp}
          </div> : ""}

          <div class="el-timeline-item__content">
            {slots.default?.()}
          </div>

          {!props.hideTimestamp && props.placement === 'bottom' ?
            <div class="el-timeline-item__timestamp is-bottom">
            {props.timestamp}
          </div> : ""}
        </div>
      </li>
    )
  }

});

export default ElTimelineItem
