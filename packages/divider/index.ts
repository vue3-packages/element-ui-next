import ElDivder from "./src/divider";
import { App } from "vue";

ElDivder.install = (app: App) => {
  app.component(ElDivder.name, ElDivder);
};

export default ElDivder;
