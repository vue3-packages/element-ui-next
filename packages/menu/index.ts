import ElMenu from "./src/Menu";
import ElMenuItem from "./src/MenuItem";
import ElSubMenu from "./src/SubMenu";
import { App, Plugin } from "vue";

const components = [ElMenu, ElMenuItem, ElSubMenu];

const menuInstall: Plugin = {
  install: (app: App) => {
    components.forEach((component) => {
      app.component(component.name, components);
    });
  },
};

export default menuInstall;

export { ElMenu, ElMenuItem, ElSubMenu };
