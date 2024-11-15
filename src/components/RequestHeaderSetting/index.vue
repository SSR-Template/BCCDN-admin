<script setup lang="ts">
import { reactive, ref } from "vue";

defineProps({
  reqHeaderTableData: Array
});
const emit = defineEmits(["delete", "create"]);

const reqHeaderModal = ref(false);
const reqHeaderFormData = reactive({});
</script>

<template>
  <div class="space-y-4">
    <el-button size="small" type="success" @click="reqHeaderModal = true"
      >新增</el-button
    >
    <el-table size="small" border :data="reqHeaderTableData">
      <el-table-column label="名称" prop="name" show-overflow-tooltip />
      <el-table-column label="值" prop="value" show-overflow-tooltip />
      <el-table-column width="100" fixed="right" label="操作">
        <template #default="{ $index }">
          <el-button size="small" type="danger" @click="emit('delete', $index)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="reqHeaderModal" title="添加缓存" append-to-body>
      <el-form
        :model="reqHeaderFormData"
        label-width="100"
        label-position="left"
      >
        <el-form-item label="内容">
          <el-input
            v-model="reqHeaderFormData.name"
            placeholder="名称"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="reqHeaderFormData.value" style="width: 200px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              emit('create', reqHeaderFormData);
              reqHeaderModal = false;
            }
          "
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
