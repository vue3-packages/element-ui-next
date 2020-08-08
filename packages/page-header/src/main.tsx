import {defineComponent} from "vue"

const ElPageHeader = defineComponent({
  name: "ElPageHeader",
  props: {
    title: {
      type: String,
      default: "返回"
    },
    content: String
  },
  setup(props, {slots, emit}){
    return () => (
      <div class="el-page-header">
        <div class="el-page-header__left" onClick={() => emit("back")}>
          <i class="el-icon-back"></i>
          <div class="el-page-header__title">
            {/* <slot name="title">{{ title }}</slot> */}
            {slots.title ? slots.title() : props.title}
          </div>
        </div>
        <div class="el-page-header__content">
          {/* <slot name="content">{{ content }}</slot> */}
          {slots.content ? slots.content() : props.content}
        </div>
      </div>
    )
  }
})
export default ElPageHeader