<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { getSiteTopStatics } from "@/api/console";
import Tabs from "@/components/Tabs/index.vue";

const tabList = [
  { label: "域名排行", value: "top-domain" },
  { label: "国家排行", value: "top-country" },
  { label: "省份排行", value: "top-province" },
  { label: "IP排行", value: "top-ip" },
  { label: "URL排行", value: "top-url" },
  { label: "Referer排行", value: "top-referer" }
];
const topList = ref([]);
const searchFormData = reactive({
  type: "top-domain",
  recent_time: "10m",
  cc: 1
});

const getData = async () => {
  const { data } = await getSiteTopStatics(searchFormData);
  topList.value = data;
};
watch(
  () => searchFormData.type,
  () => getData()
);

onMounted(async () => {
  getData();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl flex flex-col gap-y-4 h-full">
    <Tabs v-model="searchFormData.type" :tabs="tabList" />
    <div class="flex items-center gap-x-4">
      <el-input
        v-model="searchFormData.domain"
        placeholder="输入域名，多个空格分隔"
        style="width: 220px"
      />
      <el-input
        v-model="searchFormData.server_port"
        placeholder="监听端口"
        style="width: 220px"
      />
      <el-radio-group v-model="searchFormData.recent_time">
        <el-radio-button value="10m">10分钟实时</el-radio-button>
        <el-radio-button value="30m">近30分钟</el-radio-button>
        <el-radio-button value="60m">近1小时</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="getData">搜索</el-button>
    </div>
    <el-table
      size="small"
      :data="topList"
      style="width: 100%; height: 0; flex: 1"
    >
      <el-table-column
        :label="
          tabList.find(i => i.value === searchFormData.type).label.slice(0, 2)
        "
        prop="res"
      />
      <el-table-column label="请求次数" prop="count" />
      <el-table-column label="出站流量">
        <template #default="{ row }">
          {{ `${(row.traffic / 1024).toFixed(2)} KB` }}
        </template>
      </el-table-column>
      <el-table-column label="回源流量">
        <template #default="{ row }">
          {{ `${(row.up_recv / 1024).toFixed(2)} KB` }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
