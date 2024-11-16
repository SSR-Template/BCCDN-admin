<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { getStreamPortStatistics } from "@/api/fourShare";
import Tabs from "@/components/Tabs/index.vue";

const dateType = ref("10m");
const topList = ref([]);
const searchFormData = reactive({
  type: "top-ports",
  recent_time: "10m"
});

const getData = async () => {
  const { data } = await getStreamPortStatistics(searchFormData);
  topList.value = data;
};
watch(dateType, () => getData());

onMounted(async () => {
  getData();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl flex flex-col gap-y-4 h-full">
    <Tabs
      v-model="searchFormData.type"
      :tabs="[{ label: '端口排行', value: 'top-ports' }]"
    />
    <template v-if="searchFormData.type === 'top-ports'">
      <div class="flex items-center gap-x-4">
        <el-radio-group v-model="searchFormData.recent_time">
          <el-radio-button value="10m">10分钟实时</el-radio-button>
          <el-radio-button value="30m">近30分钟</el-radio-button>
          <el-radio-button value="60m">近1小时</el-radio-button>
        </el-radio-group>
        <el-button type="primary" @click="getData">刷新</el-button>
      </div>
      <el-table
        size="small"
        :data="topList"
        style="width: 100%; height: 0; flex: 1"
      >
        <el-table-column label="端口" prop="res" />
        <el-table-column label="连接数" prop="count" />
        <el-table-column label="流量">
          <template #default="{ row }">
            {{ `${row.traffic.toFixed(2)} KB` }}
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
