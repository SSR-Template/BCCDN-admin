<script setup>
import { reactive, ref, watch } from "vue";
import { getBlackList, getBlackListStatics } from "@/api/console";
import Tabs from "@/components/Tabs/index.vue";

const tabList = [
  { label: "黑名单列表", value: "list" },
  { label: "黑名单统计", value: "statistic" }
];
const currentTab = ref("list");
const blackList = ref([]);
const blackListStatics = ref([]);
const searchFormData = reactive({});
const selection = ref([]);

const getList = async () => {
  ({ data: blackList.value } = await getBlackList({ page: 1, limit: 20 }));
};

watch(
  currentTab,
  async type => {
    if (type === "list") {
      getList();
    } else {
      ({ data: blackListStatics.value } = await getBlackListStatics());
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="bg-white p-4 rounded-xl flex flex-col gap-y-4 h-full">
    <Tabs v-model="currentTab" :tabs="tabList" />
    <template v-if="currentTab === 'list'">
      <div class="flex items-center gap-x-4">
        <el-input
          v-model="searchFormData.site_id"
          placeholder="网站ID"
          style="width: 220px"
        />
        <el-input
          v-model="searchFormData.ip"
          placeholder="客户IP"
          style="width: 220px"
        />
        <el-button type="primary" @click="getList">搜索</el-button>
        <el-button type="success">导出当前黑名单</el-button>
      </div>
      <div class="flex items-center">
        <el-button size="small" type="primary">解锁所选IP</el-button>
        <el-button size="small" type="success">解锁指定网站</el-button>
      </div>
      <el-table
        size="small"
        :data="blackList"
        style="width: 100%; height: 0; flex: 1"
        @selection-change="selection = $event"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="网站ID" show-overflow-tooltip />
        <el-table-column label="域名" show-overflow-tooltip />
        <el-table-column label="IP" show-overflow-tooltip />
        <el-table-column label="过滤器" show-overflow-tooltip />
        <el-table-column label="拉黑时间" show-overflow-tooltip />
        <el-table-column label="解锁时间" show-overflow-tooltip />
      </el-table>
    </template>
    <el-table
      v-else
      size="small"
      :data="blackListStatics"
      style="width: 100%; height: 0; flex: 1"
    >
      <el-table-column prop="id" label="网站ID" show-overflow-tooltip />
      <el-table-column label="黑名单数量" show-overflow-tooltip />
    </el-table>
  </div>
</template>
