import { App } from "vue";
import Avatar from "./src/Avatar"

Avatar.install = (app: App) => {
  app.component(Avatar.name, Avatar);
};

export default Avatar;
