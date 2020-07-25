import ElContainer from "./src/main";
import { App } from "vue";

ElContainer.install = (app: App) => {
  app.component(ElContainer.name, ElContainer);
};

export default ElContainer;
