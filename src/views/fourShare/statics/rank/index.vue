<script setup lang="ts">
import { ref } from "vue";

const dateType = ref("1");
const tableData = ref([]);
</script>

<template>
  <el-card shadow="always">
    <template #header>带宽流量</template>
    <el-space :size="0" class="mb-4">
      <el-radio-group v-model="dateType" size="large">
        <el-radio-button label="1小时实况" value="1" />
        <el-radio-button label="近6小时" value="6" />
        <el-radio-button label="近12小时" value="12" />
      </el-radio-group>
    </el-space>
    <br />
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
