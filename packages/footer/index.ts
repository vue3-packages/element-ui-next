import ElFooter from "./src/main";
import { App } from "vue";

ElFooter.install = (app: App) => {
  app.component(ElFooter.name, ElFooter);
};

export default ElFooter;
