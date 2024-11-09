<script lang="ts" setup>
import { ref } from "vue";
import { getActionList } from "@/api/accountcenter";

const tableData = ref([]);
const getList = async () => {
  try {
    const { data } = await getActionList({ page: 1, limit: 10 });
    tableData.value = data;
  } catch (error) {}
};
getList();
</script>

<template>
  <el-card shadow="always">
    <el-table :data="tableData">
      <el-table-column prop="id" label="ID" show-overflow-tooltip />
      <el-table-column prop="type" label="类别" show-overflow-tooltip />
      <el-table-column prop="content" label="对象" show-overflow-tooltip />
      <el-table-column prop="action" label="动作" show-overflow-tooltip />
      <el-table-column prop="diff" label="变更内容" show-overflow-tooltip />
      <el-table-column prop="ip" label="IP" show-overflow-tooltip />
      <el-table-column
        prop="create_at2"
        label="操作时间"
        show-overflow-tooltip
      />
    </el-table>
  </el-card>
</template>
