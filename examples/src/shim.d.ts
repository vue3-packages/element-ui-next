declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare module "*.md" {
  import { Component } from "vue";
  let component: Component;
  export default component;
}
