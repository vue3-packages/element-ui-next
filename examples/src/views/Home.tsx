import { defineComponent } from "vue";
import { useStore } from "vuex";
import {ElButton} from "../../../packages/index"

export default defineComponent({
  name: "App",
  setup() {
    const store = useStore()
    return () => (
      <>
        <h1>Home</h1>
        <h1>{store.state.title}</h1>
        <ElButton></ElButton>
      </>
    );
  }
});