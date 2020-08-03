/**
 * form
 */
import { Component } from "vue";

const Empty = import("../components/empty/index");
export default {
  path: "/form",
  name: "form",
  meta: {
    title: "Form",
    key: "form",
  },
  component: (): Component => Empty,
  children: [
    {
      path: "/rate",
      name: "rate",
      meta: {
        title: "Rate 评分",
        key: "rate",
      },
      component: (): Component => import("/@docs/rate/__docs__/rate.md"),
    },
    {
      path: "/input",
      name: "input",
      meta: {
        title: "Input 输入框",
        key: "input",
      },
      component: (): Component => import("/@docs/input/__docs__/input.md"),
    },
  ],
}
