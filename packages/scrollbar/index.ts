import ElScrollbar from "./src/main";
import { App } from "vue";

ElScrollbar.install = (app: App) => {
  app.component(ElScrollbar.name, ElScrollbar);
};

export default ElScrollbar;
