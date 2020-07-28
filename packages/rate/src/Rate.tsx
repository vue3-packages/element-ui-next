import { defineComponent, inject, reactive, computed, watch } from "vue";
import { hasClass } from "../../../src/utils/dom";
import { isObject } from "../../../src/utils/types";
import { ElFormSymbol } from "../../provides";

const ElRate = defineComponent({
    name: "ElRate",
    props: {
        value: {
          type: Number,
          default: 0
        },
        lowThreshold: {
          type: Number,
          default: 2
        },
        highThreshold: {
          type: Number,
          default: 4
        },
        max: {
          type: Number,
          default: 5
        },
        colors: {
          type: [Array, Object],
          default: ["#F7BA2A", "#F7BA2A", "#F7BA2A"]
        },
        voidColor: {
          type: String,
          default: "#C6D1DE"
        },
        disabledVoidColor: {
          type: String,
          default: "#EFF2F7"
        },
        iconClasses: {
          type: [Array, Object],
          default: ["el-icon-star-on", "el-icon-star-on", "el-icon-star-on"]
        },
        voidIconClass: {
          type: String,
          default: "el-icon-star-off"
        },
        disabledVoidIconClass: {
          type: String,
          default: "el-icon-star-on"
        },
        disabled: {
          type: Boolean,
          default: false
        },
        allowHalf: {
          type: Boolean,
          default: false
        },
        showText: {
          type: Boolean,
          default: false
        },
        showScore: {
          type: Boolean,
          default: false
        },
        textColor: {
          type: String,
          default: "#1f2d3d"
        },
        texts: {
          type: Array,
          default: ["极差", "失望", "一般", "满意", "惊喜"]
        },
        scoreTemplate: {
          type: String,
          default: "{value}"
        },
        input:  Function,
        change: Function
    },
    setup(props){
      if (!props.value) {
        props.input?.(0)
      }
      const state = reactive({
        pointerAtLeftHalf: true,
        currentValue: props.value,
        hoverIndex: -1
      })
      const elForm = inject(ElFormSymbol, null)
      const rateDisabled = computed(() => {
        return props.disabled || (elForm || {}).disabled;
      })
      const text = computed(() => {
        let result: any
        if (props.showScore) {
          result = props.scoreTemplate.replace(/\{\s*value\s*\}/, rateDisabled.value
             ? props.value.toString() : state.currentValue.toString());
          } else if (props.showText) {
            result = props.texts[Math.ceil(state.currentValue) - 1];
          }
          return result;
        
      })
      const decimalStyle = computed(() => {
        let width = "";
        if (rateDisabled.value) {
          width = `${ valueDecimal.value }%`;
        } else if (props.allowHalf) {
          width = "50%";
        }
        return {
          color: activeColor.value,
          width
        };
      })
      const valueDecimal = computed(() => {
        return props.value * 100 - Math.floor(props.value) * 100;
      })
      const classMap = computed(() => {
        return Array.isArray(props.iconClasses)
          ? {
            [props.lowThreshold]: props.iconClasses[0],
            [props.highThreshold]: { value: props.iconClasses[1], excluded: true },
            [props.max]: props.iconClasses[2]
          } : props.iconClasses;
      })
      const decimalIconClass = computed(() => {
        return getValueFromMap(props.value, classMap.value);
      })
      const voidClass = computed(() => {
        return rateDisabled.value ? props.disabledVoidIconClass : props.voidIconClass;
      })
      const activeClass = computed(() => {
        return getValueFromMap(state.currentValue, classMap.value);
      })
      const colorMap = computed(() => {
        return Array.isArray(props.colors)
          ? {
            [props.lowThreshold]: props.colors[0],
            [props.highThreshold]: { value: props.colors[1], excluded: true },
            [props.max]: props.colors[2]
          } : props.colors;
      })
      const activeColor = computed(() => {
        return getValueFromMap(state.currentValue, colorMap.value);
      })
      const classes = computed(() => {
        type result = Array <any>
        let result : result = []
        let i = 0;
        let threshold = state.currentValue;
        if (props.allowHalf && state.currentValue !== Math.floor(state.currentValue)) {
          threshold--;
        }
        for (; i < threshold; i++) {
          result.push(activeClass.value);
        }
        for (; i < props.max; i++) {
          result.push(voidClass.value);
        }
        return result;
      })
      const getValueFromMap = (value, map) => {
        const matchedKeys = Object.keys(map)
          .filter(key => {
            const val = map[key];
            const excluded = isObject(val) ? val.excluded : false;
            return excluded ? value < key : value <= key;
          })
          .sort((a: any, b: any) => a - b);
        const matchedValue = map[matchedKeys[0]];
        return isObject(matchedValue.value) ? matchedValue.value : (matchedValue || "");
      }
      const getMigratingConfig = () => {
        return {
          props: {
            "text-template": "text-template is renamed to score-template."
          }
        };
      }
      const showDecimalIcon = (item) => {
        let showWhenDisabled = rateDisabled.value && valueDecimal.value > 0 && item - 1 < props.value && item > props.value;
        /* istanbul ignore next */
        let showWhenAllowHalf = props.allowHalf &&
        state.pointerAtLeftHalf &&
          item - 0.5 <= state.currentValue &&
          item > state.currentValue;
        return showWhenDisabled || showWhenAllowHalf;
      }

      const getIconStyle = (item) => {
        const voidColor = rateDisabled.value ? props.disabledVoidColor : props.voidColor;
        return {
          color: item <= state.currentValue ? activeColor.value : voidColor
      }
    }
      const selectValue = (value) => {
        if (rateDisabled.value) {
          return;
        }
        if (props.allowHalf && state.pointerAtLeftHalf) {
          // tslint:disable-next-line:no-unused-expression
          props.input?.(state.currentValue)
          // tslint:disable-next-line:no-unused-expression
          props.change?.(state.currentValue)
        } else {
          props.input?.(value);
          props.change?.(value);
        }
      }

      const handleKey = (e: { keyCode: any; stopPropagation: () => void; preventDefault: () => void; }) => {
        if (rateDisabled.value) {
          return;
        }
        let currentValue = state.currentValue;
        const keyCode = e.keyCode;
        if (keyCode === 38 || keyCode === 39) { // left / down
          if (props.allowHalf) {
            currentValue += 0.5;
          } else {
            currentValue += 1;
          }
          e.stopPropagation();
          e.preventDefault();
        } else if (keyCode === 37 || keyCode === 40) {
          if (props.allowHalf) {
            currentValue -= 0.5;
          } else {
            currentValue -= 1;
          }
          e.stopPropagation();
          e.preventDefault();
        }
        currentValue = currentValue < 0 ? 0 : currentValue;
        currentValue = currentValue > props.max ? props.max : currentValue;

        props.input?.(currentValue);
        props.change?.(currentValue);
      }

      const setCurrentValue = (value, event) => {
        if (rateDisabled.value) {
          return;
        }
        /* istanbul ignore if */
        if (props.allowHalf) {
          let target = event.target;
          if (hasClass(target, "el-rate__item")) {
            target = target.querySelector(".el-rate__icon");
          }
          if (hasClass(target, "el-rate__decimal")) {
            target = target.parentNode;
          }
          state.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
          state.currentValue = state.pointerAtLeftHalf ? value - 0.5 : value;
        } else {
          state.currentValue = value;
        }
        state.hoverIndex = value;
      }

      const resetCurrentValue = () => {
        if (rateDisabled.value) {
          return;
        }
        if (props.allowHalf) {
          state.pointerAtLeftHalf = props.value !== Math.floor(props.value);
        }
        state.currentValue = props.value;
        state.hoverIndex = -1;
      }

      const numberToArr = (val: number) => {
        let i = 1
        type arr = Array<number>
        let arr : arr = []
        for(; i <= val; i++){
         arr.push(i)
       }
       return arr
      }
      watch(() => props.value, (val) => {
        state.currentValue = val;
        state.pointerAtLeftHalf = props.value !== Math.floor(props.value);
      })
      return () => (
        <div
        class="el-rate"
        onKeydown={handleKey}
        role="slider"
        aria-valuenow={state.currentValue}
        aria-valuetext={text.value}
        aria-valuemin={0}
        aria-valuemax={props.max}
        tabindex={0}>{
          numberToArr(props.max).map((item,key) => (
            <span
              class="el-rate__item"
              onMousemove={() => setCurrentValue(item,event)}
              onMouseleave={resetCurrentValue}
              onClick={() => selectValue(item)}
              style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
              key={key}>
              <i
                class={[classes[item - 1], { "hover": state.hoverIndex === item },"el-rate__icon"]}
                style={getIconStyle(item).toString()}>
                {
                  showDecimalIcon(item) ? <i
                    class={[decimalIconClass.value,"el-rate__decimal"]}
                    style={decimalStyle.value}>
                  </i> : ""
                }
              </i>
            </span>
          ))
        }</div>
      )
      return () => {
        // tslint:disable-next-line:no-unused-expression
        <div
        class="el-rate"
        onKeydown={handleKey}
        role="slider"
        aria-valuenow={state.currentValue}
        aria-valuetext={text.value}
        aria-valuemin={0}
        aria-valuemax={props.max}
        tabindex={0}>
        {numberToArr(props.max).map((item,key) => {
          return <span
          class="el-rate__item"
          onMousemove={() => setCurrentValue(item,event)}
          onMouseleave={resetCurrentValue}
          onClick={() => selectValue(item)}
          style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
          key={key}>
          <i
            class={[classes[item - 1], { "hover": state.hoverIndex === item },"el-rate__icon"]}
            style={getIconStyle(item).toString()}>
            {showDecimalIcon(item) && <i
              class={[decimalIconClass.value,"el-rate__decimal"]}
              style={decimalStyle.value}>
            </i>}
          </i>
        </span>
        })}
        {(props.showText || props.showScore) && <span class="el-rate__text" style={{color: props.textColor }}>{{ text }}</span>}
      </div>
      }
    }
})
export default ElRate