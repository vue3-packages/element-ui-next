import { App, Plugin } from "vue";
import ElButton from "./button/index";
import ElButtonGroup from "./buttonGroup/index";
import ElAside from "./aside/index";
import ElContainer from "./container/index";
import ElFooter from "./footer/index";
import ElHeader from "./header/index";
import ElIcon from "./icon/index";
import ElMain from "./main/index";
import ElAvatar from "./avatar/index";
import Ellink from "./link/index";
import ElTag from "./tag/index";
import ElCard from "./card/index";
import ElCol from "./col/index";
import ElRow from "./row/index";
import ElRate from "./rate/index";
import ElBadge from "./badge/index";
import ElAlert from "./alert/index";

import { ElMenu, ElMenuItem, ElSubmenu, ElMenuItemGroup } from "./menu/index";

const components = [
  ElButton,
  ElButtonGroup,
  ElAside,
  ElContainer,
  ElFooter,
  ElHeader,
  ElIcon,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElAvatar,
  ElMenuItemGroup,
  Ellink,
  ElTag,
  ElCard,
  ElCol,
  ElRow,
  ElRate,
  ElBadge,
  ElAlert,
];

const install = function (app: App): void {
  components.forEach((component) => {
    app.component(component.name, component);
  });
};

const elementUiNext: Plugin = {
  install,
};

export default elementUiNext;

export {
  ElButton,
  ElButtonGroup,
  ElAside,
  ElContainer,
  ElFooter,
  ElHeader,
  ElIcon,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElSubmenu,
  ElAvatar,
  ElMenuItemGroup,
  Ellink,
  ElTag,
  ElCard,
  ElCol,
  ElRow,
  ElRate,
  ElBadge,
  ElAlert,
};
