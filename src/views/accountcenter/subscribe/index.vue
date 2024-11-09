<script lang="ts" setup>
import { ref } from "vue";
import { getSubscribe } from "@/api/accountcenter";

const tableData = ref([]);
const getList = async () => {
  try {
    const { data } = await getSubscribe();
    tableData.value = data;
  } catch (error) {}
};
getList();
</script>

<template>
  <el-card shadow="always">
    <el-table :data="tableData">
      <el-table-column prop="msg_type" label="消息类型" />
      <el-table-column prop="phone" label="手机提醒" />
      <el-table-column prop="email" label="邮件提醒" />
    </el-table>
  </el-card>
</template>
