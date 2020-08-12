import ElRadio from "./src/radio";
import ElRadioButton from "./src/radio-button";
import ElRadioGroup from "./src/radio-group";
import { App, Plugin } from "vue";

const components = [ElRadio, ElRadioButton, ElRadioGroup];

const stepsInstall: Plugin = {
  install: (app: App) => {
    components.forEach((component) => {
      app.component(component.name, components);
    });
  },
};

export default stepsInstall;

export { ElRadio, ElRadioButton, ElRadioGroup };
