import ELTooltip from './src/tooltip'
import { App } from "vue";

ELTooltip.install = (app: App) => {
  app.component(ELTooltip.name, ELTooltip);
};

export default ELTooltip;
