<script setup>
import { ElMessage } from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import {
  getACLList,
  createACL,
  optionACL,
  deleteACL,
  editACL
} from "@/api/console";
import { aclMatchList, aclMatchOperatorList } from "@/model";

const isLoading = ref(false);
const isExpendSearch = ref(false);
const searchForm = reactive({});
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getACLList({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const formData = ref({
  default_action: "allow"
});
const aclRuleList = ref([]);
const handleCreate = async () => {
  if (formData.value.id) {
    await editACL(formData.value.id, {
      ...formData.value,
      data: aclRuleList.value,
      redirect_url: "",
      reject_code: "403"
    });
    ElMessage.success("修改成功");
  } else {
    await createACL({
      ...formData.value,
      data: aclRuleList.value,
      redirect_url: "",
      reject_code: "403"
    });
    ElMessage.success("创建成功");
  }

  formData.value = {
    default_action: "allow"
  };
  aclRuleList.value = [];
  modal.value = false;
  getList();
};

const matchModal = ref(false);
const matchRuleList = ref([]);
const matchFormData = ref({
  acl_action: "allow",
  value: ""
});

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (["enable", "disable"].includes(type)) {
    await optionACL(
      selection.value.map(id => ({
        id,
        enable: type === "enable" ? 1 : 0
      }))
    );
  }

  if (type === "delete") {
    await deleteACL(selection.value.toString());
  }

  ElMessage.success("操作成功");
  getList();
};

const handleDelete = async id => {
  await deleteACL(id);
  ElMessage.success("删除成功");
  getList();
};

const handleEdit = row => {
  formData.value = {
    ...row
  };
  aclRuleList.value = JSON.parse(row.data);
  modal.value = true;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    await getList();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="h-full bg-white rounded-xl p-4 flex flex-col gap-y-4">
    <div class="flex items-center">
      <el-input
        v-model="searchForm.name"
        placeholder="名称(模糊搜索)"
        style="width: 220px"
      />
      <el-button type="primary" class="ml-3" @click="getList">搜索</el-button>
      <el-button @click="searchForm = {}">重置</el-button>
      <el-button type="primary" @click="isExpendSearch = !isExpendSearch">
        {{ isExpendSearch ? "收起" : "展开" }}
        <el-icon class="ml-2">
          <ArrowUp v-if="isExpendSearch" />
          <ArrowDown v-else />
        </el-icon>
      </el-button>
    </div>
    <div v-show="isExpendSearch" class="flex flex-wrap items-center gap-4">
      <el-select
        v-model="searchForm.enable"
        placeholder="启用"
        style="width: 220px"
      >
        <el-option label="是" value="1" />
        <el-option label="否" value="0" />
      </el-select>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-button size="small" type="success" @click="modal = true"
          >新增</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleBatchOption('enable')"
          >启用</el-button
        >
        <el-button
          size="small"
          type="warning"
          @click="handleBatchOption('disable')"
          >禁用</el-button
        >
        <el-button
          size="small"
          type="danger"
          @click="handleBatchOption('delete')"
          >删除</el-button
        >
      </div>
    </div>
    <el-table
      v-loading="isLoading"
      size="small"
      :data="tableData"
      style="width: 100%; height: 0; flex: 1"
      @selection-change="selection = $event"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="ID" show-overflow-tooltip />
      <el-table-column prop="name" label="名称" show-overflow-tooltip />
      <el-table-column label="启用" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.enable === 1 ? "已启用" : "未启用" }}
        </template>
      </el-table-column>
      <el-table-column label="配置同步" show-overflow-tooltip>
        <template> 已启用 </template>
      </el-table-column>
      <el-table-column prop="des" label="配置同步" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button size="small" type="primary" @click="handleEdit(row)">
              修改
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pagination.page"
      v-model:page-size="pagination.limit"
      size="small"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.count"
      @change="getList"
    />

    <el-dialog v-model="modal" title="新增ACL" append-to-body>
      <el-form :model="formData" label-width="100" label-position="left">
        <el-form-item label="名称">
          <el-input v-model="formData.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.des" style="width: 220px" />
        </el-form-item>
        <el-form-item label="默认行为">
          <el-radio-group v-model="formData.default_action">
            <el-radio label="允许" value="allow" />
            <el-radio label="拒绝" value="deny" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="规则列表">
          <div class="space-y-4 w-full">
            <el-button size="small" type="primary" @click="matchModal = true"
              >新增</el-button
            >
            <el-table border size="small" :data="aclRuleList" class="w-full">
              <el-table-column label="匹配" width="300" show-overflow-tooltip>
                <template #default="{ row }">
                  <div clas="space-y-2">
                    <div v-for="(item, key) in row.acl_matcher" :key="key">
                      {{ `${key} ${item.operator} ${item.value}` }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="acl_action"
                label="行为"
                show-overflow-tooltip
              />
              <el-table-column label="操作">
                <template #default="{ $index }">
                  <el-button
                    size="small"
                    type="danger"
                    @click="aclRuleList.splice($index, 1)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="matchModal" title="添加ACL规则">
      <el-form label-width="100" label-position="left" :model="matchFormData">
        <el-form-item label="匹配">
          <div class="flex gap-2 flex-wrap">
            <el-tag
              v-for="(tag, index) in matchRuleList"
              :key="index"
              closable
              type="primary"
              @close="matchRuleList.splice(index, 1)"
            >
              {{
                `${tag.name} ${tag.operator} ${tag.value.replace(/\n/g, " ")}`
              }}
            </el-tag>
          </div>
        </el-form-item>
        <div class="flex gap-x-4">
          <el-select
            v-model="matchFormData.name"
            placeholder="请选择匹配项"
            style="width: 220px"
          >
            <template v-for="item of aclMatchList">
              <el-option
                v-if="!matchRuleList.find(i => i.name === item.value)"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </template>
          </el-select>
          <el-select
            v-model="matchFormData.operator"
            placeholder="操作符"
            style="width: 220px"
          >
            <el-option
              v-for="item of aclMatchOperatorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input
            v-model="matchFormData.value"
            type="textarea"
            placeholder="一行一个匹配值，可为空"
            :rows="3"
            style="width: 220px"
          />
          <el-button
            type="primary"
            @click="
              () => {
                matchRuleList.push({ ...matchFormData });
                matchFormData = {
                  acl_action: 'allow',
                  value: ''
                };
              }
            "
          >
            添加
          </el-button>
        </div>
        <el-form-item label="行为">
          <el-radio-group v-model="matchFormData.acl_action">
            <el-radio label="允许" value="allow" />
            <el-radio label="拒绝" value="deny" />
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              aclRuleList.push({
                acl_action: matchFormData.acl_action,
                acl_code: '403',
                acl_url: '',
                acl_matcher: Object.fromEntries(
                  matchRuleList.map(item => [
                    item.name,
                    { operator: item.operator, value: item.value }
                  ])
                )
              });
              matchFormData = {
                acl_action: 'allow',
                value: ''
              };
              console.log(matchFormData);
              matchRuleList = [];
              matchModal = false;
            }
          "
        >
          提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
