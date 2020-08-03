/**
 * navigation
 */
import { Component } from "vue";

const Empty = import("../components/empty/index");
export default {
  path: "/navigation",
  name: "navigation",
  meta: {
    title: "Navigation",
    key: "navigation",
  },
  component: (): Component => Empty,
  children: [
    {
      path: "/navMenu",
      name: "navMenu",
      meta: {
        title: "NavMenu 导航菜单",
        key: "navMenu",
      },
      component: (): Component => import("/@docs/menu/__docs__/menu.md"),
    },
  ],
}
