import ElPageHeader from "./src/main";
import { App } from "vue";

ElPageHeader.install = (app: App) => {
  app.component(ElPageHeader.name, ElPageHeader);
};

export default ElPageHeader;
