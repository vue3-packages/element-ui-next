import {defineComponent, ref} from "vue"
import {ElMenu, ElMenuItem, ElSubMenu, ElMenuItemGroup} from "../../../../packages/index"
import "./cHeader.scss"

const CHeader = defineComponent({
  name: "CHeader",
  setup() {
    const activeIndex = ref("1");
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
    }
    return () => (
      <div class="c-header" style="text-align: left">
        <ElMenu
        mode="horizontal"
        activeTextColor="#ffd04b"
        textColor="#fff"
        backgroundColor="#545c64"
        menuTrigger="click"
        select={handleSelect}
        defaultActive={activeIndex.value}>
          <ElMenuItem index="1">处理中心</ElMenuItem>
          <ElSubMenu slots={{
            title: () => (
              <>
              <i class="el-icon-location"></i>
              <span>我的工作台</span>
              </>
            )
          }} index="2">
            <ElMenuItemGroup slots={{
              title: () => "分组1"
            }}>
              <ElMenuItem index="2-1">选项1</ElMenuItem>
              <ElMenuItem index="2-2">选项2</ElMenuItem>
            </ElMenuItemGroup>
            <ElMenuItem index="2-3">选项3</ElMenuItem>
            <ElSubMenu slots={{
              title: () => ("选项4")
            }} index="2-4">
              <ElMenuItemGroup slots={{
                title: () => "分组2"
              }}>
                <ElMenuItem index="2-4-1">选项1</ElMenuItem>
              </ElMenuItemGroup>
              <ElMenuItem index="2-4-2">选项2</ElMenuItem>
              <ElMenuItem index="2-4-3">选项3</ElMenuItem>
            </ElSubMenu>
          </ElSubMenu>
          <ElMenuItem disabled index="3">
            <i class="el-icon-menu"></i>
            消息中心
          </ElMenuItem>
          <ElMenuItem index="4">
            <i class="el-icon-menu"></i>
            订单管理
          </ElMenuItem>
        </ElMenu>
      </div>
    )
  }
})

export default CHeader