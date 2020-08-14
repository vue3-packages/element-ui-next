import { createApp } from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import "/@/style/index.scss";
import "../../packages/styles/index.scss";
import "./assets/prism.css";
import "./assets/prism.js";
import Preview from "./views/Preview";
import ElementUiNext from "../../packages/index";
import "./demo-styles/index.scss";
import Icons from "./assets/icon.json";
import "../src/style/fonts/style.css";
import "../../packages/theme-chalk/src/index.scss";

(window as any).icon = Icons;
(window as any).Prism.plugins.NormalizeWhitespace.setDefaults({
  indent: 0,
  "remove-trailing": true,
  "remove-indent": true,
  "left-trim": true,
  "right-trim": true,
  "remove-initial-line-feed": false,
  "tabs-to-spaces": 2,
});

const app = createApp(App);

app.component("Preview", Preview);
app.use(ElementUiNext);
app.use(router).use(store).mount("#app");
