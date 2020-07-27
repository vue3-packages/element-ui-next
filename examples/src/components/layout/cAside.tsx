import {defineComponent, ref} from "vue"
import {ElMenu, ElMenuItem, ElSubmenu, ElMenuItemGroup, ElButton} from "../../../../packages/index"
import "./cAside.scss"
import {routes} from "../../router/index"
import {RouteRecordRaw, useRouter} from "vue-router"

const CAside = defineComponent({
  name: "CHeader",
  setup() {
    const activeIndex = ref("2-1");
    const collapse = ref(false);
    const router  = useRouter()
    const handleSelect = (key, keyPath) => {
      router.push({
        name: key
      })
    }
  const renderMenus = (routes: RouteRecordRaw[]) => {
      const menus = routes.filter(item => item.meta).map((item: RouteRecordRaw) => {
        if (item.meta.type === "menuGroup") {
          return (
            <ElMenuItemGroup slots={{
              title: () => (
                <>
                <span>{item.meta.title}</span>
                </>
              )
            }}>
              {renderMenus(item.children)}
            </ElMenuItemGroup>
          )
        }else if (item.children) {
          return (
            <ElSubmenu slots={{
              title: () => (
                <>
                <span>{item.meta.title}</span>
                </>
              )
            }} index={item.meta.key}>
              {renderMenus(item.children)}
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
        <ElMenu
        collapse={collapse.value}
        select={handleSelect}
        defaultActive={activeIndex.value}>
          { renderMenus(routes[0].children) }
        </ElMenu>
      </div>
    )
  }
})

export default CAside