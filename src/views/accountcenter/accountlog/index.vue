<script lang="ts" setup>
import { ref } from "vue";
import { getSigninList } from "@/api/accountcenter";

const tableData = ref([]);
const getList = async () => {
  try {
    const { data } = await getSigninList({ page: 1, limit: 10 });
    tableData.value = data;
  } catch (error) {}
};
getList();
</script>

<template>
  <el-card shadow="always">
    <el-table :data="tableData">
      <el-table-column prop="id" label="ID" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP" show-overflow-tooltip />
      <el-table-column
        prop="create_at2"
        label="登录时间"
        show-overflow-tooltip
      />
      <el-table-column prop="success" label="登录状态" show-overflow-tooltip />
    </el-table>
  </el-card>
</template>
