import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home"),
  },
  {
    path: "/changeLog",
    name: "changeLog",
    meta: {
      title: "更新日志",
      key: "changeLog",
    },
    component: () => import("../../../ChangeLog.md"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
export { routes };
