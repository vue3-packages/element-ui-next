import ElCard from "./src/main";
import { App } from "vue";

ElCard.install = (app: App) => {
  app.component(ElCard.name, ElCard);
};

export default ElCard;
