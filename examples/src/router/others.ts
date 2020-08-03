/**
 * others
 */
import { Component } from "vue";

const Empty = import("../components/empty/index");
export default {
  path: "/others",
  name: "others",
  meta: {
    title: "Others",
    key: "others",
  },
  component: (): Component => Empty,
  children: [
    {
      path: "/card",
      name: "card",
      meta: {
        title: "Card 卡片",
        key: "card",
      },
      component: (): Component => import("/@docs/card/__docs__/card.md"),
    },
    {
      path: "/divider",
      name: "divider",
      meta: {
        title: "Divider 分割线",
        key: "divider",
      },
      component: (): Component => import("/@docs/divider/__docs__/divider.md"),
    },
    {
      path: "/timeline",
      name: "timeline",
      meta: {
        title: "Timeline 时间线",
        key: "timeline",
      },
      component: (): Component => import("/@docs/timeline/__docs__/timeline.md"),
    },
  ],
}
