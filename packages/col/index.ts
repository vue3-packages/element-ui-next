import ElCol from "./src/Col";
import { App } from "vue";

ElCol.install = (app: App) => {
  app.component(ElCol.name, ElCol);
};

export default ElCol;
