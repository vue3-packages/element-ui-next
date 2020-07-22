import {defineComponent, ref} from "vue"
import {ElMenu, ElMenuItem, ElSubMenu} from "../../../../packages/index"
import "./cAside.scss"

const CAside = defineComponent({
  name: "CHeader",
  setup() {
    const activeIndex = ref("1");
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
    }
    return () => (
      <div class="c-aside">
        <ElMenu
        // mode="horizontal"
        select={handleSelect}
        defaultActive={activeIndex.value}>
          <ElMenuItem index="1">处理中心</ElMenuItem>
          <ElSubMenu slots={{
            title: () => ("我的工作台")
          }} index="2">
            <ElMenuItem index="2-1">选项1</ElMenuItem>
            <ElMenuItem index="2-2">选项2</ElMenuItem>
            <ElMenuItem index="2-3">选项3</ElMenuItem>
            <ElSubMenu slots={{
              title: () => ("选项4")
            }} index="2-4">
              <ElMenuItem index="2-4-1">选项1</ElMenuItem>
              <ElMenuItem index="2-4-2">选项2</ElMenuItem>
              <ElMenuItem index="2-4-3">选项3</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
          <ElMenuItem disabled index="3">消息中心</ElMenuItem>
          <ElMenuItem index="4">订单管理</ElMenuItem>
        </ElMenu>
      </div>
    )
  }
})

export default CAside