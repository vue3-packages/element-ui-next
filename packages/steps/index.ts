import ElSteps from "./src/steps";
import ElStep from "./src/step";
import { App, Plugin } from "vue";

const components = [ElSteps, ElStep];

const stepsInstall: Plugin = {
  install: (app: App) => {
    components.forEach((component) => {
      app.component(component.name, components);
    });
  },
};

export default stepsInstall;

export { ElStep, ElSteps};
