<script setup lang="ts">
import { reactive, ref } from "vue";

defineProps({
  cacheTableData: Array
});
const emit = defineEmits(["delete", "create"]);

const cacheModal = ref(false);
const cacheFormData = reactive({});
const cacheRuleList = ref([]);
const cacheRuleForm = reactive({
  variable: "",
  string: ""
});
</script>

<template>
  <div class="space-y-4">
    <el-button size="small" type="success" @click="cacheModal = true"
      >新增</el-button
    >
    <el-table size="small" border :data="cacheTableData">
      <el-table-column label="类型" show-overflow-tooltip>
        <template #default="{ row }">
          {{
            row.type === "suffix"
              ? "后缀名"
              : row.type === "dir"
                ? "目录"
                : "全路径"
          }}
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="content" show-overflow-tooltip />
      <el-table-column label="有效期" prop="expire" show-overflow-tooltip />
      <el-table-column label="忽略参数" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.ignore_arg ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="分片回源" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.range ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column
        label="忽略响应头"
        prop="proxy_ignore_headers"
        show-overflow-tooltip
      />
      <el-table-column label="不缓存条件" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="flex gap-x-2">
            <el-tag
              v-for="(tag, index) in row.no_cache"
              :key="index"
              type="primary"
            >
              {{ `${tag.variable} ~ ${tag.string}` }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="100" fixed="right" label="操作">
        <template #default="{ $index }">
          <el-button size="small" type="danger" @click="emit('delete', $index)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="cacheModal" title="添加缓存" append-to-body>
      <el-form :model="cacheFormData" label-width="100" label-position="left">
        <el-form-item label="类型">
          <el-select v-model="cacheFormData.type" style="width: 200px">
            <el-option label="后缀名" value="suffix" />
            <el-option label="目录" value="dir" />
            <el-option label="全路径" value="full_path" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="cacheFormData.content"
            placeholder="多个用|分割"
            style="width: 200px"
          />
        </el-form-item>
        <div class="flex gap-x-4">
          <el-form-item label="有效期">
            <el-input v-model="cacheFormData.expire" style="width: 200px" />
          </el-form-item>
          <el-form-item label-width="0">
            <el-select
              v-model="cacheFormData.unit"
              placeholder="单位"
              style="width: 100px"
            >
              <el-option label="天" value="d" />
              <el-option label="小时" value="h" />
              <el-option label="分" value="m" />
              <el-option label="秒" value="s" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="忽略参数">
          <el-switch v-model="cacheFormData.ignore_arg" />
        </el-form-item>
        <el-form-item label="忽略响应头">
          <el-checkbox-group v-model="cacheFormData.proxy_ignore_headers">
            <el-checkbox label="X-Accel-Expires" value="X-Accel-Expires" />
            <el-checkbox label="Expires" value="Expires" />
            <el-checkbox label="Cache-Control" value="Cache-Control" />
            <el-checkbox label="Set-Cookie" value="Set-Cookie" />
            <el-checkbox label="Vary" value="Vary" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分片回源">
          <el-switch v-model="cacheFormData.range" />
          <div class="ml-16 text-gray-600">推荐单个缓存文件大于2M开启</div>
        </el-form-item>
        <el-form-item label="不缓存条件">
          <div class="flex gap-x-2">
            <el-tag
              v-for="(tag, index) in cacheRuleList"
              :key="index"
              closable
              type="primary"
              @close="cacheRuleList.splice(index, 1)"
            >
              {{ `${tag.variable} ~ ${tag.string}` }}
            </el-tag>
          </div>
        </el-form-item>
        <div class="flex items-center gap-x-4">
          <el-select
            v-model="cacheRuleForm.variable"
            placeholder="请选择匹配项"
            style="width: 200px"
          >
            <el-option label="请求URI" value="$request_uri" />
            <el-option label="请求URI(不带参数)" value="$uri" />
            <el-option label="IP地址" value="$host" />
            <el-option label="请求协议" value="$schema" />
            <el-option label="请求参数" value="$args" />
            <el-option label="域名" value="$host" />
          </el-select>
          <el-input
            v-model="cacheRuleForm.string"
            placeholder="匹配值(支持正则)"
            style="width: 200px"
          />
          <el-button
            type="primary"
            @click="cacheRuleList.push({ ...cacheRuleForm })"
            >添加</el-button
          >
        </div>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              emit('create', cacheFormData);
              cacheModal = false;
            }
          "
          >保存</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>
