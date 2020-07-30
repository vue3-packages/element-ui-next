import {defineComponent, reactive, watch, computed} from "vue"
const ElPagination = defineComponent({
  name: "ElPagination",
  props: {
    currentPage: {
      type: Number,
      default: 0
    },
    pageCount: {
      type: Number,
      default: 0
    },
    pagerCount: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  setup(props, {emit}){
    const state = reactive({
      current: null,
      showPrevMore: false,
      showNextMore: false,
      quicknextIconClass: "el-icon-more",
      quickprevIconClass: "el-icon-more"
    })
    watch(() => state.showPrevMore, (value) => {
      if (!value) state.quickprevIconClass = "el-icon-more";
    }),

    watch(() => state.showNextMore, (value) => {
      if (!value) state.quicknextIconClass = "el-icon-more";
    })
    const pagers = computed(() => {
      const pagerCount = props.pagerCount || 0;
      const halfPagerCount = (pagerCount - 1) / 2;

      const currentPage = Number(props.currentPage);
      const pageCount = Number(props.pageCount);

      let showPrevMore = false;
      let showNextMore = false;

      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true;
        }

        if (currentPage < pageCount - halfPagerCount) {
          showNextMore = true;
        }
      }
      type arr = Array<number>
      const array: arr = [];

      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2);
        for (let i = startPage; i < pageCount; i++) {
          array.push(i);
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          array.push(i);
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1;
        for (let i = currentPage - offset ; i <= currentPage + offset; i++) {
          array.push(i);
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i);
        }
      }

      state.showPrevMore = showPrevMore;
      state.showNextMore = showNextMore;

      return array;
    })
    const onPagerClick = (event) => {
      const target = event.target;
      if (target.tagName === "UL" || props.disabled) {
        return;
      }

      let newPage = Number(event.target.textContent);
      const pageCount = props.pageCount || 0;
      const currentPage = props.currentPage || 0;
      const pagerCountOffset = (props.pagerCount || 2) - 2;

      if (target.className.indexOf("more") !== -1) {
        if (target.className.indexOf("quickprev") !== -1) {
          newPage = currentPage - pagerCountOffset;
        } else if (target.className.indexOf("quicknext") !== -1) {
          newPage = currentPage + pagerCountOffset;
        }
      }

      /* istanbul ignore if */
      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1;
        }

        if (newPage > pageCount) {
          newPage = pageCount;
        }
      }

      if (newPage !== currentPage) {
        emit("change", newPage);
      }
    }

    const onMouseenter = (direction) => {
      if (props.disabled) return;
      if (direction === "left") {
        state.quickprevIconClass = "el-icon-d-arrow-left";
      } else {
        state.quicknextIconClass = "el-icon-d-arrow-right";
      }
    }

    return () => (
    <ul onClick={onPagerClick} class="el-pager">
    {props.pageCount > 0 ? <li
      class={[{ active: props.currentPage === 1, disabled: props.disabled }, "number"]}>1
    </li> : ""}
    {state.showPrevMore ? <li
      class={[state.quickprevIconClass, {  disabled: props.disabled }, "el-icon more btn-quickprev"]}
      onMouseenter={() => onMouseenter("left")}
      onMouseleave={() => state.quickprevIconClass = "el-icon-more"}>
    </li> : ""}
    {pagers.value.map(pager => {
      return <li
      key={pager}
      class={[{ active: props.currentPage === pager, disabled: props.disabled }, "number"]}>{{ pager }}</li>
    })}
    {state.showNextMore ? <li
      class={[state.quicknextIconClass, { disabled: props.disabled }, "el-icon more btn-quicknext"]}
      onMouseenter={() => onMouseenter("right")}
      onMouseleave={() => state.quicknextIconClass = "el-icon-more"}>
    </li> : ""}
    {props.pageCount > 1 ? <li
      class={[{ active: props.currentPage === props.pageCount, disabled: props.disabled }, "number"]}>
        { props.pageCount }</li> : ""}
  </ul>
    )
  }
})

export default ElPagination
