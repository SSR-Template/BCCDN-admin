<script setup>
import { onMounted, ref, watch } from "vue";
import { getStreamPortStatistics } from "@/api/fourShare";

const currentTab = ref("rank");
const dateType = ref("10m");
const topList = ref([]);

const getData = async () => {
  const { data } = await getStreamPortStatistics({
    recent_time: dateType.value,
    type: "top-ports"
  });
  topList.value = data;
};
watch(dateType, () => getData());

onMounted(async () => {
  getData();
});
</script>

<template>
  <div class="bg-white p-4 rounded-xl flex flex-col gap-y-4 h-full">
    <div class="rounded-xl p-2 bg-slate-100">
      <div
        :class="[
          'font-bold w-[120px] text-center py-2 rounded-xl text-sm',
          currentTab === 'rank' ? 'text-[#5570E2] bg-white' : 'text-slate-500'
        ]"
      >
        端口排行
      </div>
    </div>
    <template v-if="currentTab === 'rank'">
      <div class="flex items-center gap-x-4">
        <el-radio-group v-model="dateType">
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
