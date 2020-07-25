import ELTag from './src/Tag'
import { App } from "vue";

ELTag.install = (app: App) => {
  app.component(ELTag.name, ELTag);
};

export default ELTag;
