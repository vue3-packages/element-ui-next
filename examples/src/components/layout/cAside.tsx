import {defineComponent, ref} from "vue"
import {ElMenu, ElMenuItem, ElSubmenu, ElMenuItemGroup, ElButton} from "../../../../packages/index"
import "./cAside.scss"
import {routes} from "../../router/index"
import {RouteRecordRaw} from "vue-router"

const CAside = defineComponent({
  name: "CHeader",
  setup() {
    const activeIndex = ref("2-1");
    const collapse = ref(false)
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
    }
    const renderMenus = () => {
      const menus = routes.filter(item => item.meta).map((item: RouteRecordRaw) => {
        if (item.children) {
          return (
            <ElSubmenu slots={{
              title: () => (
                <>
                <span>{item.meta.title}</span>
                </>
              )
            }} index={item.meta.key}>

            </ElSubmenu>
          )
        } else {
          return (
            <ElMenuItem index={item.meta.key}>{item.meta.title}</ElMenuItem>
          )
        }
      })
      return menus
    }
    return () => (
      <div class="c-aside">
        <ElButton onClick={() => {collapse.value = false}}>展开</ElButton>
        <ElButton onClick={() => {collapse.value = true}}>收起</ElButton>
        <ElMenu
        collapse={collapse.value}
        select={handleSelect}
        defaultActive={activeIndex.value}>
          { renderMenus() }
          {/* <ElMenuItem index="1">更新日志</ElMenuItem>
          <ElSubmenu slots={{
            title: () => (
              <>
              <span>组件</span>
              </>
            )
          }} index="2">
            <ElMenuItemGroup slots={{
              title: () => "Basic"
            }}>
              <ElMenuItem index="2-1">Container 布局容器</ElMenuItem>
              <ElMenuItem index="2-2">Icon 图标</ElMenuItem>
              <ElMenuItem index="2-2">Button 按钮</ElMenuItem>
            </ElMenuItemGroup>
          </ElSubmenu> */}
        </ElMenu>
      </div>
    )
  }
})

export default CAside