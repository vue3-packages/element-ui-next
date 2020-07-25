import { App } from "vue";
import Button from "./src/Button";

Button.install = (app: App) => {
  app.component(Button.name, Button);
};

export default Button;
