import ElMain from "./src/main";
import { App } from "vue";

ElMain.install = (app: App) => {
  app.component(ElMain.name, ElMain);
};

export default ElMain;
