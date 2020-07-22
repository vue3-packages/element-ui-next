import ElAside from "./src/main";
import { App } from "vue";

ElAside.install = (app: App) => {
  app.component(ElAside.name, ElAside);
};

export default ElAside;
