<script lang="ts" setup>
import { ref } from "vue";
import { getMyOrderList } from "@/api/accountcenter";

const tableData = ref([]);
const getList = async () => {
  try {
    const { data } = await getMyOrderList({ page: 1, limit: 10 });
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
      <el-table-column prop="title" label="支付方式" show-overflow-tooltip />
      <el-table-column
        prop="user_package_id"
        label="订单号"
        show-overflow-tooltip
      />
      <el-table-column prop="site_id" label="备注" show-overflow-tooltip />
      <el-table-column
        prop="create_at2"
        label="原价 (元)"
        show-overflow-tooltip
      />
      <el-table-column
        prop="create_at2"
        label="实际支付 (元)"
        show-overflow-tooltip
      />
      <el-table-column prop="create_at2" label="更多" show-overflow-tooltip />
      <el-table-column
        prop="create_at2"
        label="创建时间"
        show-overflow-tooltip
      />
      <el-table-column prop="create_at2" label="状态" show-overflow-tooltip />
    </el-table>
  </el-card>
</template>
