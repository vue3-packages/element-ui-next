import ElRow from "./src/row";
import { App } from "vue";

ElRow.install = (app: App) => {
  app.component(ElRow.name, ElRow);
};

export default ElRow;
