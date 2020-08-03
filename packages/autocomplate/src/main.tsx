import {defineComponent, reactive, computed, watch, ref, provide, onMounted, getCurrentInstance, nextTick} from "vue"
import debounce from "throttle-debounce/debounce";
import ElInput from "../../input/index";
import ElAutocompleteSuggestions from "./autocomplete-suggestions";
import Migrating from "../../../src/mixins/migrating";
import Focus from "../../../src/mixins/focus";
import { generateId } from "../../../src/utils/util";
import {EventBus, IEventBus} from "../../../src/tools/eventBus"

export default defineComponent({
  name: "ElAutocomplete",
  props: {
    valueKey: {
      type: String,
      default: "value"
    },
    popperClass: String,
    popperOptions: Object,
    placeholder: String,
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    name: String,
    size: String,
    value: String,
    maxlength: Number,
    minlength: Number,
    autofocus: Boolean,
    fetchSuggestions: Function,
    triggerOnFocus: {
      type: Boolean,
      default: true
    },
    customItem: String,
    selectWhenUnmatched: {
      type: Boolean,
      default: false
    },
    prefixIcon: String,
    suffixIcon: String,
    label: String,
    debounce: {
      type: Number,
      default: 300
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    hideLoading: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    highlightFirstItem: {
      type: Boolean,
      default: false
    }
  },
  setup (props, {emit, attrs, slots}) {
    const eventBus: IEventBus = new EventBus()
    provide("autocomplete_eventBus", eventBus)

    const data = reactive({
      activated: false,
      suggestions: [],
      loading: false,
      highlightedIndex: -1,
      suggestionDisabled: false
    })

    const suggestionVisible = computed(() => {
      const suggestions = data.suggestions;
      let isValidData = Array.isArray(suggestions) && suggestions.length > 0;
      return (isValidData || data.loading) && data.activated;
    })
    const id = computed(() => {
      return `el-autocomplete-${generateId()}`;
    })

    const input = ref(null)
    const instance = getCurrentInstance() as any
    const getData = (queryString) => {
      if (data.suggestionDisabled) {
        return;
      }
      data.loading = true;
      props.fetchSuggestions?.(queryString, (suggestions) => {
        data.loading = false;
        if (data.suggestionDisabled) {
          return;
        }
        if (Array.isArray(suggestions)) {
          data.suggestions = suggestions as never[];
          data.highlightedIndex = props.highlightFirstItem ? 0 : -1;
        } else {
          // tslint:disable-next-line:no-console
          console.error("[Element Error][Autocomplete]autocomplete suggestions must be an array");
        }
      });
    }
    const select = (item) => {
      emit("input", item[props.valueKey]);
      emit("select", item);
      nextTick(() => {
        data.suggestions = [];
        data.highlightedIndex = -1;
      });
    }
    onMounted(() => {
      instance.debouncedGetData = debounce(props.debounce, getData);
      eventBus.on("ElAutocomplete_item-click", item => {
        select(item);
      });
      let $input = getInput();
      $input.setAttribute("role", "textbox");
      $input.setAttribute("aria-autocomplete", "list");
      $input.setAttribute("aria-controls", "id");
      $input.setAttribute("aria-activedescendant", `${id.value}-item-${data.highlightedIndex}`);
    })
    const getInput = () => {
      return (input.value as any)?.getInput();
    }
    watch(() => suggestionVisible.value, (val) => {
      let $input = getInput();
      if ($input) {
        eventBus.emit("ElAutocompleteSuggestions_visible", [val, $input.offsetWidth])
      }
    })

    const handleInput = (value) => {
      emit("input", value);
      data.suggestionDisabled = false;
      if (!props.triggerOnFocus && !value) {
        data.suggestionDisabled = true;
        data.suggestions = [];
        return;
      }
      instance.debouncedGetData(value);
    }
    const handleChange = (value) => {
      emit("change", value);
    }
    const handleFocus = (event) => {
      data.activated = true;
      emit("focus", event);
      if (props.triggerOnFocus) {
        instance.debouncedGetData(props.value);
      }
    }
    const handleBlur = (event) => {
      emit("blur", event);
    }
    const handleClear = () => {
      data.activated = false;
      emit("clear");
    }
    return () => (
      <div
        class="el-autocomplete"
        // v-clickoutside="close"
        aria-haspopup="listbox"
        role="combobox"
        aria-expanded={suggestionVisible.value}
        aria-owns={id.value}
      >
        <ElInput
          {...attrs}
          {...props}
          ref={input}
          onInput={handleInput}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClear={handleClear}
          slots={slots}
        >
        </ElInput>
        <ElAutocompleteSuggestions
        visible-arrow
        class={[props.popperClass ? props.popperClass : ""]}
        popper-options={props.popperOptions}
        append-to-body={props.popperAppendToBody}
        placement={props.placement}
        id={id.value}>
          {
            data.suggestions.map((item, index) => (
              <li
              class={{"highlighted": data.highlightedIndex === index}}
              onClick={() => select(item)}
              id={`${id}-item-${index}`}
              key={index}
              role="option"
              aria-selected={data.highlightedIndex === index}>
                {
                  slots.default?.(item)
                }
              </li>
            ))
          }
        </ElAutocompleteSuggestions>
      </div>
    )
  }
})