import { defineComponent, inject, reactive, computed, getCurrentInstance, nextTick } from "vue"
import Emitter from "../../../src/mixins/emitter";
const ElRadio = defineComponent({
  name: "ElRadio",
  props: {
    modelValue: {},
    label: {},
    disabled: Boolean,
    name: String,
    border: Boolean,
    size: String
  },
  mixins: [Emitter],
  componentName: "ElRadio",
  setup(props, {attrs, emit}){
    const elForm = inject("elForm")
    const elFormItem = inject("elFormItem")
    const state = reactive({
      focus: false
    })
    const instance = getCurrentInstance()
    const isGroup = computed(() =>{
      let parent = instance?.parent;
      while (parent) {
        if (parent.$options.componentName !== "ElRadioGroup") {
          parent = parent.parent;
        } else {
          this._radioGroup = parent;
          return true;
        }
      }
      return false;
    }),
    const model = computed({
      get() {
        return isGroup.value ? this._radioGroup.value : props.modelValue;
      },
      set(val) {
        if (isGroup.value) {
          dispatch("ElRadioGroup", "input", [val]);
        } else {
          (attrs as any)["onUpdate:modelValue"](val)
        }
        this.$refs.radio && (this.$refs.radio.checked = model.value === props.label);
      }
    }),
    const _elFormItemSize = computed(() => {
      return (elFormItem as any || {}).elFormItemSize;
    }),
    const radioSize = computed(() => {
      const temRadioSize = props.size || _elFormItemSize.value || (this.$ELEMENT || {}).size;
      return isGroup.value
        ? this._radioGroup.radioGroupSize || temRadioSize
        : temRadioSize;
    }),
    const isDisabled = computed(() => {
      return isGroup.value
        ? this._radioGroup.disabled || props.disabled || (elForm as any || {}).disabled
        : props.disabled || (elForm as any || {}).disabled;
    }),
    const tabIndex = computed(() => {
      return (isDisabled.value || (isGroup.value && model.value !== props.label)) ? -1 : 0;
    })

    const handleChange = () => {
      nextTick(() => {
        emit("change", model.value);
        isGroup.value && this.dispatch("ElRadioGroup", "handleChange", model.value);
      });
    }
    return () => (
      <label class={["el-radio",props.border && radioSize.value ? "el-radio--" + radioSize.value : "",
      { "is-disabled": isDisabled.value },
      { "is-focus": focus },
      { "is-bordered": props.border },
      { "is-checked": model.value === props.label }
    ]}
    role="radio"
    aria-checked={model.value === props.label}
    aria-disabled={isDisabled.value}
    tabindex={tabIndex.value}
    @keydown.space.stop.prevent={model.value = isDisabled.value ? model.value : props.label}
  >
    <span class="el-radio__input"
      :class="{
        'is-disabled': isDisabled,
        'is-checked': model === label
      }"
    >
      <span class="el-radio__inner"></span>
      <input
        ref="radio"
        class="el-radio__original"
        :value="label"
        type="radio"
        aria-hidden="true"
        v-model="model"
        @focus="focus = true"
        @blur="focus = false"
        @change="handleChange"
        :name="name"
        :disabled="isDisabled"
        tabindex="-1"
      >
    </span>
    <span class="el-radio__label" @keydown.stop>
      <slot></slot>
      <template v-if="!$slots.default">{{label}}</template>
    </span>
  </label>
    )
  }
})

export default ElRadio