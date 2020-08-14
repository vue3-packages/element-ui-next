import ElPopover from "./src/main";
// import directive from "./src/directive";
import { App } from "vue";

ElPopover.install = (app: App) => {
  // app.directive("popover", directive);
  app.component(ElPopover.name, ElPopover);
};
// ElPopover.directive = directive;
export default ElPopover;
