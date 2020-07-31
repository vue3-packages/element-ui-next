import ELTimeline from "./src/main";
import { App } from "vue";

ELTimeline.install = (app: App) => {
  app.component(ELTimeline.name, ELTimeline);
};

export default ELTimeline;
