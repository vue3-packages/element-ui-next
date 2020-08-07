import { defineComponent, reactive, computed, getCurrentInstance, onBeforeUnmount, onMounted} from "vue";

const ElStep = defineComponent({
  name: "ElStep",
  props: {
    title: String,
    icon: String,
    description: String,
    status: String
  },
  setup(props,{slots}){
    const instance = getCurrentInstance()
    const parent = instance?.parent
    // @ts-ignore
    // parent.steps.push(instance)
    const {ctx} = parent
    ctx.steps.push(instance)
    onBeforeUnmount (() => {

      const steps = ctx.steps;
      const index = steps.indexOf(this);
      if (index >= 0) {
        steps.splice(index, 1);
      }
    })
    onMounted(() =>{
      const unwatch = instance?.ctx.$watch("index", val => {
        instance?.ctx.$watch("parent.ctx.active", updateStatus, { immediate: true });
        instance.ctx.$watch("parent.ctx.processStatus", () => {
          const activeIndex = ctx.active;
          updateStatus(activeIndex);
        }, { immediate: true });
        unwatch();
      });
    })
    const state = reactive({
      index: -1,
      lineStyle: {},
      internalStatus: ""
    });
    // @ts-ignore
    const currentStatus = computed(() => {
      return props.status || state.internalStatus;
    })
    const prevStatus = computed(() => {
      const prevStep = ctx.steps[state.index - 1];
      return prevStep ? prevStep.currentStatus : "wait";
    })
    const isCenter = computed(() =>{
      return ctx.alignCenter;
    })
    const isVertical = computed(()=> {
      return ctx.direction === "vertical";
    })
    const isSimple = computed(() => {
      return ctx.simple;
    })
    const isLast = computed(() => {
      return ctx.steps[ctx.steps.length - 1] === instance;
    })
    const stepsCount = computed(() => {
      return ctx.steps.length;
    })
    const space = computed(() => {
      return isSimple.value ? "" : instance?.ctx.space ;
    })
    const style = computed(() => {
      const style = {
        flexBasis: "",
        maxWidth: "",
        marginRight: ""
      };
      const len =ctx.steps.length;

      const space1 = (typeof space.value === "number"
        ? space.value + "px"
        : space.value
          ? space.value
          : 100 / (len - (isCenter.value ? 0 : 1)) + "%");
      style.flexBasis = space1;
      if (isVertical.value) return style;
      if (isLast.value) {
        style.maxWidth = 100 / stepsCount.value + "%";
      } else {
        style.marginRight = - ctx.stepOffset + "px";
      }

      return style;
    })
    const updateStatus = (val) => {
      const prevChild = parent.subTree.children[state.index - 1];
      if (val > state.index) {
        state.internalStatus = ctx.finishStatus;
      } else if (val === state.index && prevStatus.value !== "error") {
        state.internalStatus = ctx.processStatus;
      } else {
        state.internalStatus = "wait";
      }

      if (prevChild) calcProgress(state.internalStatus);
    }

    const calcProgress = (status) => {
      let step = 100;
      const style = {
        transitionDelay: "",
        borderWidth: "",
        height: "",
        width: ""
      };

      style.transitionDelay = 150 * state.index + "ms";
      if (status === ctx.processStatus) {
        step = currentStatus.value !== "error" ? 0 : 0;
      } else if (status === "wait") {
        step = 0;
        style.transitionDelay = (-150 * state.index) + "ms";
      }

      style.borderWidth = step && !isSimple.value ? "1px" : "0";
      ctx.direction === "vertical"
        ? style.height = step + "%"
        : style.width = step + "%";

      state.lineStyle = style;
    }
    return () => (
      <div
        style={style.value}
        class={["el-step",
          !isSimple.value && `is-${ctx.direction}`,
          isSimple.value && "is-simple",
          isLast.value && !space.value && !isCenter.value && "is-flex",
          isCenter.value && !isVertical.value && !isSimple.value && "is-center"
         ]}>
        <div class={[`is-${currentStatus.value}`, "el-step__head"]}>
          <div
            class="el-step__line"
            style={isLast.value ? "" : { marginRight: ctx.stepOffset + "px" }}>
            <i class="el-step__line-inner" style={state.lineStyle}></i>
          </div>

          <div class={`is-${props.icon ? "icon" : "text"}`}>
          {
            currentStatus.value !== "success" && currentStatus.value !== "error" ? <slot name="icon">
              {props.icon ? <i class={["el-step__icon-inner", props.icon]}></i> : ""}
                {!props.icon && !isSimple.value ? <div class="el-step__icon-inner">{ state.index +1 }</div> : ""}
            </slot> : <i class={[ `el-icon-${currentStatus.value === "success" ? "check" : "close"}`,
              "el-step__icon-inner is-status"]}></i>
          }
          </div>
         </div>
        {/*// <!-- title & description -->*/}
        <div class="el-step__main">
          <div
            ref="title"
            class={["is-" + currentStatus.value,"el-step__title"]}>
            {slots.title?.()}
          </div>
          {isSimple.value ? <div class="el-step__arrow"></div>
           : <div
            class={["is-" + currentStatus.value,"el-step__description"]}>
          {slots.description?.()}
          </div>}
        </div>
      </div>
    )
  }
})

export default ElStep
