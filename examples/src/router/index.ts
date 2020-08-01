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
          },
          {
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
          },
          {
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
          },
          {
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
          },
          {
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
          },
          {
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
