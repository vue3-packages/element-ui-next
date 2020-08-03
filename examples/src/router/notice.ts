/**
 * notice
 */
import { Component } from "vue";

const Empty = import("../components/empty/index");
export default {
  path: "/notice",
  name: "notice",
  meta: {
    title: "Notice",
    key: "notice",
  },
  component: (): Component => Empty,
  children: [
    {
      path: "/alert",
      name: "alert",
      meta: {
        title: "Alert 警告",
        key: "alert",
      },
      component: (): Component => import("/@docs/alert/__docs__/alert.md"),
    },
  ],
}
