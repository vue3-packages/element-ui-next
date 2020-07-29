import {defineComponent, computed, PropType, reactive} from "vue"
const ElAlert = defineComponent({
  name: "ElAlert",
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    type: {
      type: String,
      default: "info"
    },
    closable: {
      type: Boolean,
      default: true
    },
    closeText: {
      type: String,
      default: ""
    },
    showIcon: Boolean,
    center: Boolean,
    effect: {
      type: String as PropType <"light" | "dark">,
      default: "light",
    }
  },
  setup(prpos, {slots,emit}){
    const state = reactive({
      visible: true
    })
    const TYPE_CLASSES_MAP = {
      success: "el-icon-success",
      warning: "el-icon-warning",
      error: "el-icon-error"
    };
    const close = () => {
      state.visible = false;
      emit("close");
    }
    const typeClass = computed(() => {
      return `el-alert--${ prpos.type }`;
    })

    const iconClass = computed(() => {
      return TYPE_CLASSES_MAP[prpos.type] || "el-icon-info";
    })

    const isBigIcon = computed(() => {
      return prpos.description || slots.default ? "is-big" : "";
    })

    const isBoldTitle = computed(() => {
      return prpos.description || slots.default ? "is-bold" : "";
    })
    return () => (
      // <transition name="el-alert-fade">
      state.visible ? <div
      class={[typeClass.value, prpos.center ? "is-center" : "", "is-" + prpos.effect, "el-alert"]}
      v-show="visible"
      role="alert">
      {prpos.showIcon ? <i class={[ iconClass.value, isBigIcon.value,"el-alert__icon" ]}></i> : ""}
      <div class="el-alert__content">
        {prpos.title || slots.title ? <span class={[isBoldTitle.value, "el-alert__title"]}>
          <slot name="title">{prpos.title}</slot>
        </span> : ""}
        {slots.default && !prpos.description ? <p class="el-alert__description">{slots.default?.()}</p> : ""}
        {prpos.description && !slots.default ? <p class="el-alert__description">{ prpos.description }</p> : ""}
        {prpos.closable ? <i class={[prpos.closeText !== "" ? "is-customed" : "", prpos.closeText === "" ? "el-icon-close": "" ,
            "el-alert__closebtn"]} onClick={() => close()}>{prpos.closeText}</i> : ""
        }
      </div>
    </div> : ""
  // </transition>
    )
  }
})
export default ElAlert
