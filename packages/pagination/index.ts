import ElPagination from "./src/pager";
import { App } from "vue";

/* istanbul ignore next */
ElPagination.install = (app: App) => {
  app.component(ElPagination.name, ElPagination);
};

export default ElPagination;
