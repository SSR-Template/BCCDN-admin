<script setup>
import { getOverview, getMessage, getUserInfo } from "@/api/welcome";
import { getSigninList } from "@/api/accountcenter";
import { onMounted, ref } from "vue";

const overviewInfo = ref({});
const messageList = ref([]);
const userInfo = ref({});
const logList = ref([]);

onMounted(async () => {
  ({ data: overviewInfo.value } = await getOverview());
  ({ data: messageList.value } = await getMessage({ type: "announcement" }));
  ({ data: userInfo.value } = await getUserInfo());
  ({ data: logList.value } = await getSigninList({ page: 1, limit: 2 }));
});
</script>

<template>
  <div class="flex gap-x-4 h-full">
    <div class="space-y-4 flex-1 flex flex-col">
      <div class="flex items-center gap-x-4">
        <div
          class="flex-1 flex items-center h-[136px] rounded-xl px-4 gap-x-4 bg-white"
        >
          <img
            class="size-[46px]"
            src="https://cdn.sudun.com/users/img/fwgl1.2f3d1bca.svg"
          />
          <div>
            <div class="text-slate-500 text-sm">接入域名数</div>
            <div class="space-x-2">
              <span class="text-2xl font-bold">{{
                overviewInfo.domain_count
              }}</span>
              <span>个</span>
            </div>
          </div>
        </div>
        <div
          class="flex-1 flex items-center h-[136px] rounded-xl px-4 gap-x-4 bg-white"
        >
          <img
            class="size-[46px]"
            src="https://cdn.sudun.com/users/img/fwgl2.14eaadce.svg"
          />
          <div>
            <div class="text-slate-500 text-sm">转发端口数</div>
            <div class="space-x-2">
              <span class="text-xl font-bold">{{
                overviewInfo.stream_port_count
              }}</span>
              <span>个</span>
            </div>
          </div>
        </div>
        <div
          class="flex-1 flex items-center h-[136px] rounded-xl px-4 gap-x-4 bg-white"
        >
          <img
            class="size-[46px]"
            src="https://cdn.sudun.com/users/img/fwgl3.6205d921.svg"
          />
          <div>
            <div class="text-slate-500 text-sm">证书总数</div>
            <div class="space-x-2">
              <span class="text-xl font-bold">{{
                overviewInfo.cert_count
              }}</span>
              <span>个</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white rounded-xl p-4 flex flex-col gap-y-4">
        <div class="font-bold">公告</div>
        <div v-for="item of messageList" :key="item">{{ item }}</div>
        <div v-if="!messageList.length">暂无公告</div>
      </div>
    </div>
    <div
      class="bg-white rounded-xl p-4 flex flex-col gap-y-4 w-[400px] text-sm"
    >
      <div class="font-bold">个人信息</div>
      <div>
        您好，<span class="font-bold">{{ userInfo.name }}</span>
      </div>
      <el-tag type="primary" class="w-[200px]">IP: {{ logList[0]?.ip }}</el-tag>
      <div class="text-xs text-slate-500">
        最后登录：{{ logList[1]?.create_at2 }}
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">ID</div>
        <div class="font-bold">{{ overviewInfo.uid }}</div>
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">实名认证</div>
        <div v-if="overviewInfo.cert_verified" class="font-bold">已实名</div>
        <router-link v-else to="/accountcenter">
          <el-tag type="warning">未实名，点击去认证</el-tag>
        </router-link>
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">余额</div>
        <div class="font-bold">{{ overviewInfo.balance }}元</div>
      </div>
      <div class="flex items-center gap-x-8">
        <div class="w-[100px] text-slate-500">待续费</div>
        <div class="font-bold">{{ overviewInfo.renew }}</div>
      </div>
    </div>
  </div>
</template>
