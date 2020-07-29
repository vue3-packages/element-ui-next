import ElInput from "./src/input";
import { App } from "vue";

ElInput.install = (app: App) => {
  app.component(ElInput.name, ElInput);
};

export default ElInput;
