/**
 * data
 */
import { Component } from "vue";

const Empty = import("../components/empty/index");
export default {
  path: "/data",
  name: "data",
  meta: {
    title: "Data",
    key: "data",
  },
  component: (): Component => Empty,
  children: [
    {
      path: "/tag",
      name: "tag",
      meta: {
        title: "Tag 标签",
        key: "tag",
      },
      component: (): Component => import("/@docs/tag/__docs__/tag.md"),
    },
    {
      path: "/badge",
      name: "badge",
      meta: {
        title: "Badge 标记",
        key: "badge",
      },
      component: (): Component => import("/@docs/badge/__docs__/badge.md"),
    },
    {
      path: "/avatar",
      name: "avatar",
      meta: {
        title: "Avatar 头像",
        key: "avatar",
      },
      component: (): Component => import("/@docs/avatar/__docs__/avatar.md"),
    },
  ],
}
