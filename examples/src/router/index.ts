import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import { Component } from "vue";

const Empty = import("../components/empty/index");
import basic from "./basic";
import form from "./form";
import data from "./data";
import notice from "./notice";
import navigation from "./navigation";
import others from "./others";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: (): Component => import("../views/Home"),
    children: [
      {
        path: "/",
        redirect: "/changeLog",
      },
      {
        path: "/changeLog",
        name: "changeLog",
        meta: {
          title: "更新日志",
          key: "changeLog",
        },
        component: (): Component => import("/@docs/ChangeLog.md"),
      },
      {
        path: "/dev_doc",
        name: "dev_doc",
        meta: {
          title: "开发指南",
          key: "dev_doc",
        },
        component: (): Component => Empty,
        children: [
          {
            path: "/install",
            name: "install",
            meta: {
              title: "安装",
              key: "install",
            },
            component: (): any => import("/@docs/install.md"),
          },
          {
            path: "/quick_start",
            name: "quick_start",
            meta: {
              title: "快速上手",
              key: "quick_start",
            },
            component: (): any => import("/@docs/QuickStart.md"),
          },
        ],
      },
      {
        path: "/components",
        name: "components",
        meta: {
          title: "组件",
          key: "components",
          type: "menuGroup",
        },
        component: (): Component => Empty,
        children: [basic, form, data, notice, navigation, others],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
export { routes };
