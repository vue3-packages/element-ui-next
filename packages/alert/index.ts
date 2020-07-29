import { App } from "vue";
import ElAlert from "./src/alert";

ElAlert.install = (app: App) => {
  app.component(ElAlert.name, ElAlert);
};

export default ElAlert;
