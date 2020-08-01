import ElTimeline from "./src/timeline";
import ElTimelineItem from "./src/item";
import { App, Plugin } from "vue";

const components = [ElTimeline, ElTimelineItem];

const timelineInstall: Plugin = {
  install: (app: App) => {
    components.forEach((component) => {
      app.component(component.name, components);
    });
  },
};

export default timelineInstall;

export { ElTimeline, ElTimelineItem};
