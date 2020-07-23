import { defineComponent } from "vue";
import {ElContainer, ElMain, ElHeader, ElAside, ELAvatar} from "../../../packages/index"
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
          <ElAside width="400px">
            <CAside/>
          </ElAside>
          <ElMain><ELAvatar size="1000" src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">zzz</ELAvatar></ElMain>
        </ElContainer>
      </ElContainer>
    );
  }
});