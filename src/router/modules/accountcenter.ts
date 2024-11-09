export default {
  path: "/accountcenter",
  redirect: "/accountcenter/personal",
  meta: {
    icon: "ep:user",
    title: "账户中心",
    rank: 9
  },
  children: [
    {
      path: "/accountcenter/personal",
      name: "Personal",
      component: () => import("@/views/accountcenter/personal/index.vue"),
      meta: {
        title: "个人资料"
      }
    },
    {
      path: "/accountcenter/recharge",
      name: "Recharge",
      component: () => import("@/views/accountcenter/recharge/index.vue"),
      meta: {
        title: "账户充值"
      }
    },
    {
      path: "/accountcenter/subscribe",
      name: "Subscribe",
      component: () => import("@/views/accountcenter/subscribe/index.vue"),
      meta: {
        title: "消息订阅"
      }
    },
    {
      path: "/accountcenter/subsearch",
      name: "SubSearch",
      component: () => import("@/views/accountcenter/subsearch/index.vue"),
      meta: {
        title: "消息查询"
      }
    },
    {
      path: "/accountcenter/myorder",
      name: "MyOrder",
      component: () => import("@/views/accountcenter/myorder/index.vue"),
      meta: {
        title: "消费记录"
      }
    },
    {
      path: "/accountcenter/accountlog",
      name: "AccountLog",
      component: () => import("@/views/accountcenter/accountlog/index.vue"),
      meta: {
        title: "登录日志"
      }
    },
    {
      path: "/accountcenter/actionlog",
      name: "ActionLog",
      component: () => import("@/views/accountcenter/actionlog/index.vue"),
      meta: {
        title: "操作日志"
      }
    },
    {
      path: "/accountcenter/apiconfig",
      name: "ApiConfig",
      component: () => import("@/views/accountcenter/apiconfig/index.vue"),
      meta: {
        title: "API密钥"
      }
    }
  ]
} satisfies RouteConfigsTable;
