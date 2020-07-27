import { defineComponent, inject, reactive, computed } from "vue";
import { hasClass } from "../../../src/utils/dom";
import { isObject } from "../../../src/utils/types";
import { ElFormSymbol } from "../../provides";
import { type } from './../../popper/src/usePopper';

const ELRate = defineComponent({
    name: "ELRate",
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
        input: Function,
        change: Function
    },
    setup(props, { attrs, slots }){
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
        return isObject(matchedValue) ? matchedValue.value : (matchedValue || "");
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
      },

      const getIconStyle = (item) => {
        const voidColor = rateDisabled.value ? props.disabledVoidColor : props.voidColor;
        return {
          color: item <= state.currentValue ? activeColor : voidColor
        };
      },

      const selectValue = (value) => {
        if (rateDisabled.value) {
          return;
        }
        if (props.allowHalf && state.pointerAtLeftHalf) {
         props.input(state.currentValue);
          this.$emit('change', state.currentValue);
        } else {
          this.$emit('input', value);
          this.$emit('change', value);
        }
      },

      const handleKey = (e) => {
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
        currentValue = currentValue > this.max ? this.max : currentValue;

        this.$emit('input', currentValue);
        this.$emit('change', currentValue);
      },

      setCurrentValue(value, event) {
        if (this.rateDisabled) {
          return;
        }
        /* istanbul ignore if */
        if (this.allowHalf) {
          let target = event.target;
          if (hasClass(target, 'el-rate__item')) {
            target = target.querySelector('.el-rate__icon');
          }
          if (hasClass(target, 'el-rate__decimal')) {
            target = target.parentNode;
          }
          this.pointerAtLeftHalf = event.offsetX * 2 <= target.clientWidth;
          this.currentValue = this.pointerAtLeftHalf ? value - 0.5 : value;
        } else {
          this.currentValue = value;
        }
        this.hoverIndex = value;
      },

      resetCurrentValue() {
        if (this.rateDisabled) {
          return;
        }
        if (this.allowHalf) {
          this.pointerAtLeftHalf = this.value !== Math.floor(this.value);
        }
        this.currentValue = this.value;
        this.hoverIndex = -1;
      }
      return () => {
          // <div
      //   class="el-rate"
      //   @keydown="handleKey"
      //   role="slider"
      //   :aria-valuenow="currentValue"
      //   :aria-valuetext="text"
      //   aria-valuemin="0"
      //   :aria-valuemax="max"
      //   tabindex="0">
      //   {max.map((item,key) => {
      //     return <span
      //     class="el-rate__item"
      //     @mousemove="setCurrentValue(item, $event)"
      //     @mouseleave="resetCurrentValue"
      //     @click="selectValue(item)"
      //     :style="{ cursor: rateDisabled ? 'auto' : 'pointer' }"
      //     key={key}>
      //     <i
      //       :class="[classes[item - 1], { 'hover': hoverIndex === item }]"
      //       class="el-rate__icon"
      //       style={getIconStyle(item)}>
      //       {showDecimalIcon(item) && <i
      //         class={decimalIconClass}
      //         style={decimalStyle}
      //         class="el-rate__decimal">
      //       </i>}
      //     </i>
      //   </span>
      //   })}
      //   // tslint:disable-next-line: no-unused-expression
      //   {(props.showText || props.showScore) && <span class="el-rate__text" style={ {"color: textColor"} }>{{ text }}</span>}
      // </div>
      }
    },
})
export default ELRate