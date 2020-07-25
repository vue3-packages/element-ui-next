import ElHeader from "./src/main";
import { App } from "vue";

ElHeader.install = (app: App) => {
  app.component(ElHeader.name, ElHeader);
};

export default ElHeader;
