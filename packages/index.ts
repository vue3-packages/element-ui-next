import { App, Plugin } from "vue";
import ElButton from "./button/index";
import ElButtonGroup from "./buttonGroup/index";

const components = [ElButton, ElButtonGroup];

const install = function (Vue: App): void {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

const elementUiNext: Plugin = {
  install,
};

export default elementUiNext;

export { ElButton, ElButtonGroup };
