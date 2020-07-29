import { App } from "vue";
import ElBadge from "./src/badge";

ElBadge.install = (app: App) => {
  app.component(ElBadge.name, ElBadge);
};

export default ElBadge;
