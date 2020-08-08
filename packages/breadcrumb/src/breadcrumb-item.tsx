{/* <template>
import { defineComponent } from 'vue';
  <span class="el-breadcrumb__item">
    <span
      :class="['el-breadcrumb__inner', to ? 'is-link' : '']"
      ref="link"
      role="link">
      <slot></slot>
    </span>
    <i v-if="separatorClass" class="el-breadcrumb__separator" :class="separatorClass"></i>
    <span v-else class="el-breadcrumb__separator" role="presentation">{{separator}}</span>
  </span>
</template>
<script>
  export default {
    name: 'ElBreadcrumbItem',
    props: {
      to: {},
      replace: Boolean
    },
    data() {
      return {
        separator: '',
        separatorClass: ''
      };
    },

    inject: ['elBreadcrumb'],

    mounted() {
      this.separator = this.elBreadcrumb.separator;
      this.separatorClass = this.elBreadcrumb.separatorClass;
      const link = this.$refs.link;
      link.setAttribute('role', 'link');
      link.addEventListener('click', _ => {
        const { to, $router } = this;
        if (!to || !$router) return;
        this.replace ? $router.replace(to) : $router.push(to);
      });
    }
  };
</script> */}
import { defineComponent, inject, reactive, onMounted ,getCurrentInstance} from "vue"

const ElBreadcrumbItem = defineComponent({
  name: "ElBreadcrumbItem",
  props: {
    to: {},
    replace: Boolean
  },
  setup(props, {slots}){
    const elBreadcrumb = inject("elBreadcrumb") as any
    const instance = getCurrentInstance()
    const state = reactive({
      separator: "",
      separatorClass: ""
    })
    onMounted(() => {
      state.separator = elBreadcrumb.props.separator;
      state.separatorClass = elBreadcrumb.props.separatorClass;
      console.log(instance.$router)
      const link = instance?.refs.link as any
      link.setAttribute("role", "link");
      link.addEventListener("click", (_: any) => {
        const { to, $router } = instance;
        if (!to || !$router) return;
        instance.replace ? $router.replace(to) : $router.push(to);
      });
    })
    return () => (
      <span class="el-breadcrumb__item">
        <span
          class={["el-breadcrumb__inner", props.to ? "is-link" : ""]}
          ref="link"
          role="link">
          {slots.default?.()}
        </span>
        {state.separatorClass ? <i class={[state.separatorClass, "el-breadcrumb__separator"]}></i>
         : <span class="el-breadcrumb__separator" role="presentation">{state.separator}</span>}
      </span>
    )
  }
})
export default ElBreadcrumbItem
