import ElMenu from "./src/Menu";
import ElMenuItem from "./src/MenuItem";
import ElSubmenu from "./src/Submenu";
import ElMenuItemGroup from "./src/MenuItemGroup";
import { App, Plugin } from "vue";

const components = [ElMenu, ElMenuItem, ElSubmenu, ElMenuItemGroup];

const menuInstall: Plugin = {
  install: (app: App) => {
    components.forEach((component) => {
      app.component(component.name, components);
    });
  },
};

export default menuInstall;

export { ElMenu, ElMenuItem, ElSubmenu, ElMenuItemGroup };
