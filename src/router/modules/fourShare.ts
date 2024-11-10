export default {
  path: "/fourShare",
  redirect: "/fourShare/myshare",
  meta: {
    icon: "ep:setting",
    title: "四层转发",
    rank: 3
  },
  children: [
    {
      path: "/fourShare/myshare",
      name: "MyShare",
      component: () => import("@/views/fourShare/myShare/index.vue"),
      meta: {
        title: "我的转发"
      }
    },
    {
      path: "/fourShare/shareGroup",
      name: "ShareGroup",
      component: () => import("@/views/fourShare/shareGroup/index.vue"),
      meta: {
        title: "分组管理"
      }
    },
    {
      path: "/fourShare/statics",
      name: "Statics",
      redirect: "/fourShare/statics/realTime",
      meta: {
        title: "监控统计"
      },
      children: [
        {
          path: "/fourShare/statics/realTime",
          name: "RealTime",
          component: () =>
            import("@/views/fourShare/statics/realTime/index.vue"),
          meta: {
            title: "实时监控"
          }
        },
        {
          path: "/fourShare/statics/rank",
          name: "Rank",
          component: () => import("@/views/fourShare/statics/rank/index.vue"),
          meta: {
            title: "资源排行"
          }
        },
        {
          path: "/fourShare/statics/search",
          name: "Search",
          component: () => import("@/views/fourShare/statics/search/index.vue"),
          meta: {
            title: "用量查询"
          }
        }
      ]
    }
  ]
} satisfies RouteConfigsTable;
