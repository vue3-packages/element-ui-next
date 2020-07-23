import ElLink from "./src/Link";
import { App } from "vue";

ElLink.install = (app: App) => {
  app.component(ElLink.name, ElLink);
};

export default ElLink;
