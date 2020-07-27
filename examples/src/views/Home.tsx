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
        <ElHeader height="80px">
          <CHeader/>
        </ElHeader>
        <ElContainer>
          <ElAside width="300px">
            <CAside/>
          </ElAside>
          <ElMain class="main-doc">
            <RouterView></RouterView>
          </ElMain>
        </ElContainer>
        <ElFooter height="40px"/>
      </ElContainer>
    );
  }
});
