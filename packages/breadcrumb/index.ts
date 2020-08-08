import ElBreadcrumb from "./src/breadcrumb";
import ElBreadcrumbItem from "./src/breadcrumb-item";
import { App, Plugin } from "vue";

const components = [ElBreadcrumb, ElBreadcrumbItem];

const breadcrumbInstall: Plugin = {
  install: (app: App) => {
    components.forEach((component) => {
      app.component(component.name, components);
    });
  },
};

export default breadcrumbInstall;

export { ElBreadcrumb, ElBreadcrumbItem };
