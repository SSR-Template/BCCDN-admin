<script lang="ts" setup>
import { ref } from "vue";
import { getSubscribeMessage } from "@/api/accountcenter";

const tableData = ref([]);
const getList = async () => {
  try {
    const { data } = await getSubscribeMessage({ page: 1, limit: 10 });
    tableData.value = data;
  } catch (error) {}
};
getList();
</script>

<template>
  <el-card shadow="always">
    <el-table :data="tableData">
      <el-table-column prop="id" label="ID" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" show-overflow-tooltip />
      <el-table-column prop="title" label="标题" show-overflow-tooltip />
      <el-table-column
        prop="user_package_id"
        label="用户套餐ID"
        show-overflow-tooltip
      />
      <el-table-column prop="site_id" label="网站ID" show-overflow-tooltip />
      <el-table-column
        prop="create_at2"
        label="创建时间"
        show-overflow-tooltip
      />
      <el-table-column prop="action" label="操作">
        <template #default>
          <div class="flex items-center gap-x-1">
            <el-button type="primary" size="small">详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
