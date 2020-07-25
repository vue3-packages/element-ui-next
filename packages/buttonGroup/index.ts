import { App } from "vue";
import ButtonGroup from "./src/ButtonGroup";

ButtonGroup.install = (app: App) => {
  app.component(ButtonGroup.name, ButtonGroup);
};

export default ButtonGroup;
