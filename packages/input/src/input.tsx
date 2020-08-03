import {defineComponent, inject, ref, computed, nextTick, watch, onMounted, getCurrentInstance} from "vue"
import {IEventBus} from "../../../src/tools/eventBus"
import {isKorean} from "../../../src/utils/shared"
import {prevent} from "../../../src/utils/dom"
import merge from "../../../src/utils/merge"
import calcTextareaHeight from "./calcTextareaHeight";

export default defineComponent({
  name: "ElInput",
  props: {
    modelValue: [String, Number],
    size: String,
    resize: String,
    form: String,
    disabled: Boolean,
    readonly: Boolean,
    type: {
      type: String,
      default: "text"
    },
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    autocomplete: {
      type: String,
      default: "off"
    },
    autoComplete: {
      type: String
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
    suffixIcon: String,
    prefixIcon: String,
    label: String,
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    tabindex: String
  },
  setup (props, {slots, attrs, emit}) {
    const eventBus = inject("formEventBus") as IEventBus
    const instance = getCurrentInstance()

    const elForm = inject("form") as any
    const elFormItem = inject("formItem") as any

    const input = ref(null)
    const textarea = ref(null)
    const passwordVisible = ref(false)
    const hovering = ref(false)
    const isComposing = ref(false)

    const select = () => {
      getInput().select();
    }
    eventBus?.on("inputSelect", select);
    const textareaCalcStyle = ref({})
    const resizeTextarea = () => {
      if (!document) return;
      const { autosize, type } = props;
      if (type !== "textarea") return;
      if (!autosize) {
        textareaCalcStyle.value = {
          minHeight: calcTextareaHeight(textarea.value).minHeight
        };
        return;
      }
      const minRows = autosize.minRows;
      const maxRows = autosize.maxRows;

      textareaCalcStyle.value = calcTextareaHeight(textarea.value, minRows, maxRows);
    }
    onMounted(() => {
      setNativeInputValue();
      resizeTextarea();
      updateIconOffset();
    })
    
    watch(() => props.modelValue, (val) => {
      nextTick(resizeTextarea)
      eventBus?.emit("ElFormItem_el.form.change", [val])
    })
    const calcIconOffset = (place) => {
      const $el = instance?.vnode.el as HTMLElement
      let elList = [].slice.call($el.querySelectorAll(`.el-input__${place}`) || []) as HTMLElement[];
      if (!elList.length) return;
      let el: HTMLElement = null as unknown as HTMLElement;
      for (let i = 0; i < elList.length; i++) {
        if (elList[i].parentNode === $el) {
          el = elList[i];
          break;
        }
      }
      if (!el) return;
      const pendantMap = {
        suffix: "append",
        prefix: "prepend"
      };

      const pendant = pendantMap[place];
      if (slots[pendant]) {
        el.style.transform = `translateX(${place === "suffix" ? "-" : ""}${($el.querySelector(`.el-input-group__${pendant}`) as HTMLElement).offsetWidth}px)`;
      } else {
        el.removeAttribute("style");
      }
    }
    const updateIconOffset = () => {
      calcIconOffset("prefix");
      calcIconOffset("suffix");
    }
    watch(() => props.type, () => {
      nextTick(() => {
        setNativeInputValue();
        resizeTextarea();
        updateIconOffset();
      });
    })

    const inputDisabled = computed(() => {
      return props.disabled || elForm?.disabled;
    })

    const handleCompositionStart = () => {
      isComposing.value = true
    }
    const handleCompositionUpdate = (event) => {
      const text = event.target.value;
      const lastCharacter = text[text.length - 1] || "";
      isComposing.value = !isKorean(lastCharacter);
    }
    const handleCompositionEnd = (event) => {
      if (isComposing.value) {
        isComposing.value = false;
        handleInput(event);
      }
    }
    watch(() => nativeInputValue, () => {
      setNativeInputValue()
    })
    const nativeInputValue = computed(() => {
      return props.modelValue === null || props.modelValue === undefined ? "" : String(props.modelValue);
    })
    const setNativeInputValue = () => {
      const input = getInput();
      if (!input) return;
      if (input.value === nativeInputValue.value) return;
      input.value = nativeInputValue.value;
    }
    
    const getInput = () => {
      return (input.value || textarea.value) as unknown as HTMLInputElement;
    }
    const handleInput = (event) => {
      // should not emit input during composition
      // see: https://github.com/ElemeFE/element/issues/10516
      if (isComposing.value) return;

      // hack for https://github.com/ElemeFE/element/issues/8548
      // should remove the following line when we don't support IE
      if (event.target.value === nativeInputValue.value) return;
      (attrs as any)["onUpdate:modelValue"](event.target.value)
      emit("input", event.target.value);

      // ensure native input value is controlled
      // see: https://github.com/ElemeFE/element/issues/12850
      nextTick(setNativeInputValue);
    }

    const focused = ref(false)
    const handleFocus = (event) => {
      focused.value = true;
      emit("focus", event);
    }

    const handleBlur = () => {
      focused.value = false;
      emit("blur", event);
      if (props.validateEvent) {
        eventBus?.emit("ElFormItem_el.form.blur", [props.modelValue])
      }
    }

    const handleChange = (event) => {
      emit("change", event.target.value);
    }

    const showClear = computed(() => {
      return props.clearable &&
        !inputDisabled.value &&
        !props.readonly &&
        nativeInputValue.value &&
        (focused.value || hovering.value);
    })
    const isWordLimitVisible = computed(() => {
      return props.showWordLimit &&
        attrs.maxlength &&
        (props.type === "text" || props.type === "textarea") &&
        !inputDisabled.value &&
        !props.readonly &&
        !props.showPassword;
    })
    const validateState = computed(() => {
      return elFormItem ? elFormItem.validateState : "";
    })
    const needStatusIcon = computed(() => {
      return elForm ? elForm.statusIcon : false;
    })
    const getSuffixVisible = () => {
      return slots.suffix ||
        props.suffixIcon ||
        showClear.value ||
        props.showPassword ||
        isWordLimitVisible.value ||
        (validateState.value && needStatusIcon.value);
    }

    const showPwdVisible = computed(() => {
      return props.showPassword &&
        !inputDisabled.value &&
        !props.readonly &&
        (!!nativeInputValue.value || focused.value);
    })

    
    const clear = () => {
      (attrs as any)["onUpdate:modelValue"]("")
      emit("input", "");
      emit("change", "");
      emit("clear");
    }

    const handlePasswordVisible = () => {
      passwordVisible.value = !passwordVisible.value;
      focus();
    }

    const focus = () => {
      getInput().focus();
    }

    const textLength = computed(() => {
      if (typeof props.modelValue === "number") {
        return String(props.modelValue).length;
      }

      return (props.modelValue as string || "").length;
    })

    const upperLimit = computed(() => {
      return attrs.maxlength;
    })

    const validateIcon = computed(() => {
      return {
        validating: "el-icon-loading",
        success: "el-icon-circle-check",
        error: "el-icon-circle-close"
      }[validateState.value];
    })

    const renderInput = () => {
      return (
        <>
          {/* 前置元素 */}
          {
            slots.prepend ? (
              <div class="el-input-group__prepend">
                {slots.prepend()}
              </div>
            ): ""
          }
          <input
            {...attrs}
            value={props.modelValue as string}
            tabindex={props.tabindex as unknown as number}
            class="el-input__inner"
            type={props.showPassword ? (passwordVisible.value ? "text": "password") : props.type}
            disabled={inputDisabled.value}
            readonly={props.readonly}
            autocomplete={props.autoComplete}
            ref={input}
            onCompositionstart={handleCompositionStart}
            onCompositionupdate={handleCompositionUpdate}
            onCompositionend={handleCompositionEnd}
            onInput={handleInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-label={props.label}
          />
          {/* 前置内容 */}
          {
            slots.prefix || props.prefixIcon ? (
              <span class="el-input__prefix">
                {slots.prefix?.()}
                {
                  props.prefixIcon ? (
                    <i class={[
                        props.prefixIcon,
                        "el-input__icon"
                      ]}>
                    </i>
                  ) : ""
                }
              </span>
            ) : ""
          }
          {/* 后置内容 */}
          {
            getSuffixVisible() ? (
              <span class="el-input__suffix">
                <span class="el-input__suffix-inner">
                  {
                    (!showClear.value || !showPwdVisible.value || !isWordLimitVisible.value) ? (
                      <>
                        {slots.suffix?.()}
                        {
                          props.suffixIcon ? (
                            <i class={[
                                props.suffixIcon,
                                "el-input__icon"
                              ]}>
                            </i>
                          ) : ""
                        }
                      </>
                    ) : ""
                  }
                  {
                    showClear.value ? (
                      <i class="el-input__icon el-icon-circle-close el-input__clear"
                        onMousedown={prevent}
                        onClick={clear}
                      ></i>
                    ) : ""
                  }
                  {
                    showPwdVisible.value ? (
                      <i class="el-input__icon el-icon-view el-input__clear"
                        onClick={handlePasswordVisible}
                      ></i>
                    ) : ""
                  }
                  {
                    isWordLimitVisible.value ? (
                      <span class="el-input__count">
                        <span class="el-input__count-inner">
                        { textLength.value }/{ upperLimit.value }
                        </span>
                      </span>
                    ) : ""
                  }
                </span>
                {
                  validateState.value ? (
                    <i class={["el-input__icon", "el-input__validateIcon", validateIcon.value]}></i>
                  ) : ""
                }
              </span>
            ) : ""
          }
          {/* 后置元素 */}
          {
            slots.append ? (
              <div class="el-input-group__append">
                {slots.append?.()}
              </div>
            ) : ""
          }
        </>
      )
    }

    const textareaStyle = computed(() => {
      return merge({}, textareaCalcStyle.value, { resize: props.resize });
    })
    const renderTextarea = () => {
      return (
        <textarea
          {...attrs}
          value={props.modelValue as string}
          tabindex={props.tabindex as unknown as number}
          class="el-textarea__inner"
          onCompositionstart={handleCompositionStart}
          onCompositionupdate={handleCompositionUpdate}
          onCompositionend={handleCompositionEnd}
          onInput={handleInput}
          ref={textarea}
          disabled={inputDisabled.value}
          readonly={props.readonly}
          autocomplete={props.autoComplete}
          style={textareaStyle.value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-label={props.label}
        >
        </textarea>
      )
    }

    const _elFormItemSize = computed(() => {
      return (elFormItem || {}).elFormItemSize;
    })
    const inputSize = computed(() => {
      // 全局变量
      // return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      return props.size || _elFormItemSize.value;
    })
    const inputExceed = computed(() => {
      // show exceed style if length of initial value greater then maxlength
      return isWordLimitVisible.value && (textLength.value > (upperLimit.value as number));
    })

    return () => (
      <div class={
        [
          props.type === "textarea" ? "el-textarea" : "el-input",
          inputSize.value ? "el-input--" + inputSize.value : "",
          {
            "is-disabled": inputDisabled.value,
            "is-exceed": inputExceed.value,
            "el-input-group": slots.prepend || slots.append,
            "el-input-group--append": slots.append,
            "el-input-group--prepend": slots.prepend,
            "el-input--prefix": slots.prefix || props.prefixIcon,
            "el-input--suffix": slots.suffix || props.suffixIcon || props.clearable || props.showPassword
          }
        ]
      }
        onMouseenter={() => {hovering.value = true}}
        onMouseleave={() => {hovering.value = false}}
      >
        {
          props.type !== "textarea" ? renderInput() : renderTextarea()
        }
        {
          isWordLimitVisible.value && props.type === "textarea" ? (
            <span class="el-input__count">{ textLength.value }/{ upperLimit.value }</span>
          ) : ""
        }
      </div>
    )
  }
})