import {defineComponent, computed, VNode, PropType} from "vue"

const ElContainer = defineComponent({
  name: "ElContainer",
  props: {
    direction: {
      type: String as PropType<"vertical" | "horizontal">
    },
  },
  setup(props, {slots}) {
    const isVertical = computed(() => {
      if (props.direction === "vertical") {
        return true;
      } else if (props.direction === "horizontal") {
        return false;
      }
      if (slots && slots.default) {
        const vNodes: VNode[] = slots.default()
        return vNodes.some((vNode: any) => {
          const tag = vNode.type.name;
          return tag === "ElHeader" || tag === "ElFooter";
        });
      } else {
        return false
      }
    })
    return () => (
      <section class={{
        "el-container": true,
        "is-vertical": isVertical.value
      }}>
        {slots.default?.()}
      </section>
    )
  }
})

export default ElContainer