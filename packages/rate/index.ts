import ElRate from "./src/Rate";
import { App } from "vue";

ElRate.install = (app: App) => {
  app.component(ElRate.name, ElRate);
};

export default ElRate;
