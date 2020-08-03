/**
 * basic
 */
import { Component } from "vue";

const Empty = import("../components/empty/index");
export default {
  path: "/basic",
  name: "basic",
  meta: {
    title: "Basic",
    key: "basic",
  },
  component: (): Component => Empty,
  children: [
    {
      path: "/layout",
      name: "layout",
      meta: {
        title: "Layout 布局",
        key: "layout",
      },
      component: (): Component => import("/@docs/layout/__docs__/layout.md"),
    },
    {
      path: "/container",
      name: "container",
      meta: {
        title: "Container 布局容器",
        key: "container",
      },
      component: (): Component => import("/@docs/container/__docs__/container.md"),
    },
    {
      path: "/button",
      name: "button",
      meta: {
        title: "Button 按钮",
        key: "button",
      },
      component: (): Component => import("/@docs/button/__docs__/button.md"),
    },
    {
      path: "/icon",
      name: "icon",
      meta: {
        title: "Icon 图标",
        key: "icon",
      },
      component: (): Component => import("/@docs/icon/__docs__/icon.md"),
    },
    {
      path: "/link",
      name: "link",
      meta: {
        title: "Link 文字链接",
        key: "link",
      },
      component: (): Component => import("/@docs/link/__docs__/link.md"),
    },
  ],
}
