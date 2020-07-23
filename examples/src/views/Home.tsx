import { defineComponent } from "vue";
import {ElContainer, ElMain, ElHeader, ElAside} from "../../../packages/index"
import CHeader from "../components/layout/cHeader"
import CAside from "../components/layout/cAside"

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
          <ElAside style="text-align: left;" width="400px">
            <CAside/>
          </ElAside>
          <ElMain>Main</ElMain>
        </ElContainer>
      </ElContainer>
    );
  }
});