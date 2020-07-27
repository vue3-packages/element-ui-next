import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import { Component } from "vue";

const Empty = import("../components/empty/index");

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
        children: [
          {
            path: "/basic",
            name: "basic",
            meta: {
              title: "Basic",
              key: "basic",
            },
            component: (): Component => Empty,
            children: [
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
            ],
          },
        ],
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
