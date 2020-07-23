import { ref, onMounted, Ref } from "vue";

function useRender(): {
  render: Ref;
} {
  const render = ref(0);
  onMounted(() => {
    render.value = Math.random();
  });
  return {
    render,
  };
}

export default useRender;
