import { defineComponent } from "vue";
import {ElContainer, ElMain, ElHeader, ElAside, ElFooter} from "../../../packages/index"
import CHeader from "../components/layout/cHeader"
import CAside from "../components/layout/cAside"
import {RouterView} from "vue-router"

import "./Home.scss"


export default defineComponent({
  name: "App",
  setup() {
    return () => (
      <ElContainer class="element-ui-next">
        <ElHeader class="element-ui-next-h" height="80px">
          <CHeader/>
        </ElHeader>
        <ElContainer class="element-ui-next-c">
          <ElAside class="element-ui-next-a" width="300px">
            <CAside/>
          </ElAside>
          <ElMain class="main-doc element-ui-next-m">
            <RouterView></RouterView>
          </ElMain>
        </ElContainer>
        <ElFooter class="element-ui-next-f" height="40px"/>
      </ElContainer>
    );
  }
});
