import { App, Plugin } from "vue";
import ElButton from "./button/index";

const components = [ElButton];

const install = function (Vue: App): void {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

const elementUiNext: Plugin = {
  install,
};

export default elementUiNext;

export { ElButton };
