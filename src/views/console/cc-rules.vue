<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import Tabs from "@/components/Tabs/index.vue";
import {
  getCCRuleList,
  createCCRule,
  optionCCRule,
  editCCRule,
  deleteCCRule,
  getCCMatchList,
  createCCMather,
  optionCCMather,
  editCCMather,
  deleteCCMather,
  getCCFilterList,
  createCCFilter,
  optionCCFilter,
  editCCFilter,
  deleteCCFilter
} from "@/api/console";
import { aclMatchList, aclMatchOperatorList, ccFilterList } from "@/model";

const tabList = [
  {
    label: "规则组",
    value: "rule"
  },
  {
    label: "匹配器",
    value: "matcher"
  },
  {
    label: "过滤器",
    value: "filter"
  }
];
const currentTab = ref("rule");
watch(currentTab, () => {
  pagination.page = 1;
  selection.value = [];
  getList();
});

const router = useRouter();
const isLoading = ref(false);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  let data = null;
  switch (currentTab.value) {
    case "rule":
      data = await getCCRuleList({
        ...pagination,
        internal: 0
      });
      break;
    case "matcher":
      data = await getCCMatchList({
        ...pagination,
        internal: 0
      });
      break;
    case "filter":
      data = await getCCFilterList({
        ...pagination,
        internal: 0
      });
      break;
  }
  tableData.value = data.data;
  pagination.count = data.count;
};

const modal = ref(false);

const formData = ref({
  is_show: true
});
const ruleList = ref([]);
const ruleModal = ref(false);
const ruleFormData = ref({
  state: true
});
const filterList = ref([]);
const matcherList = ref([]);

const matcherFormData = ref({});
const matcherRuleList = ref([]);
const matcherRuleModal = ref(false);
const matcherRuleFormData = ref({});

const filterFormData = ref({
  extra: {}
});
watch(
  () => filterFormData.value.type,
  val => {
    if (val === "url_auth") {
      filterFormData.value.extra = {
        key: "XeS2E3R3YpAHCZM3",
        mode: "TypeA",
        sign_name: "sign",
        sign_use_times: "10",
        time_diff: "180",
        time_name: "t"
      };
    } else {
      filterFormData.value.extra = {};
    }
  }
);

const handleCreate = async () => {
  if (currentTab.value === "rule") {
    const data = {
      ...matcherFormData.value,
      data: ruleList.value
    };
    formData.value.id
      ? await editCCRule(formData.value.id, data)
      : await createCCRule(data);
    formData.value = {};
    ruleList.value = [];
  }
  if (currentTab.value === "matcher") {
    const data = {
      ...matcherFormData.value,
      data: Object.fromEntries(
        matcherRuleList.value.map(i => [
          i.name,
          {
            operator: i.operator,
            value: i.value
          }
        ])
      )
    };
    matcherFormData.value.id
      ? await editCCMather(matcherFormData.value.id, data)
      : await createCCMather(data);
    matcherFormData.value = {};
    matcherRuleList.value = [];
  }
  if (currentTab.value === "filter") {
    filterFormData.value.id
      ? await editCCFilter(filterFormData.value.id, filterFormData.value)
      : await createCCFilter(filterFormData.value);
    filterFormData.value = {};
  }
  ElMessage.success("操作成功");
  modal.value = false;
  getList();
};

const handleEdit = row => {
  if (currentTab.value === "rule") {
    formData.value = {
      ...row,
      is_show: !!row.is_show
    };
    ruleList.value = JSON.parse(row.data);
  }
  if (currentTab.value === "matcher") {
    matcherFormData.value = { ...row };
    matcherRuleList.value = Object.entries(JSON.parse(row.data)).map(i => ({
      name: i[0],
      operator: i[1].operator,
      value: i[1].value
    }));
  }
  if (currentTab.value === "filter") {
    filterFormData.value = {
      ...row,
      extra: JSON.parse(row.extra)
    };
  }
  modal.value = true;
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (["enable", "disable"].includes(type)) {
    if (currentTab.value === "rule") {
      await optionCCRule(
        selection.value.map(id => ({
          id,
          enable: type === "enable" ? 1 : 0
        }))
      );
    }
    if (currentTab.value === "matcher") {
      await optionCCMather(
        selection.value.map(id => ({
          id,
          enable: type === "enable" ? 1 : 0
        }))
      );
    }
    if (currentTab.value === "filter") {
      await optionCCFilter(
        selection.value.map(id => ({
          id,
          enable: type === "enable" ? 1 : 0
        }))
      );
    }
  }

  if (type === "delete") {
    if (currentTab.value === "rule") {
      await deleteCCRule(selection.value.toString());
    }
    if (currentTab.value === "matcher") {
      await deleteCCMather(selection.value.toString());
    }
    if (currentTab.value === "filter") {
      await deleteCCFilter(selection.value.toString());
    }
  }

  ElMessage.success("操作成功");
  getList();
};

const handleDelete = async id => {
  if (currentTab.value === "rule") {
    await deleteCCRule(id);
  }
  if (currentTab.value === "matcher") {
    await deleteCCMather(id);
  }
  if (currentTab.value === "filter") {
    await deleteCCFilter(id);
  }
  ElMessage.success("删除成功");
  getList();
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
    <Tabs v-model="currentTab" :tabs="tabList" />
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
      <template v-if="currentTab === 'rule'">
        <el-table-column label="ID" prop="id" show-overflow-tooltip />
        <el-table-column label="排序" prop="sort" show-overflow-tooltip />
        <el-table-column label="名称" prop="name" show-overflow-tooltip />
        <el-table-column
          label="创建时间"
          prop="create_at2"
          show-overflow-tooltip
        />
        <el-table-column label="启用" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.enable === 1 ? "已开启" : "未开启" }}
          </template>
        </el-table-column>
        <el-table-column label="显示" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.is_show === 1 ? "已开启" : "未开启" }}
          </template>
        </el-table-column>
        <el-table-column label="配置同步" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.state === null ? "已完成" : "未完成" }}
          </template>
        </el-table-column>
      </template>
      <template v-if="currentTab === 'matcher'">
        <el-table-column label="ID" prop="id" show-overflow-tooltip />
        <el-table-column label="名称" prop="name" show-overflow-tooltip />
        <el-table-column
          label="创建时间"
          prop="create_at2"
          show-overflow-tooltip
        />
        <el-table-column
          label="更新时间"
          prop="update_at2"
          show-overflow-tooltip
        />
        <el-table-column label="启用" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.enable === 1 ? "已开启" : "未开启" }}
          </template>
        </el-table-column>
        <el-table-column label="配置同步" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.state === null ? "已完成" : "未完成" }}
          </template>
        </el-table-column>
      </template>
      <template v-if="currentTab === 'filter'">
        <el-table-column prop="id" label="ID" show-overflow-tooltip />
        <el-table-column prop="name" label="名称" show-overflow-tooltip />
        <el-table-column label="类型" show-overflow-tooltip>
          <template #default="{ row }">
            {{ ccFilterList.find(i => i.value === row.type).label }}
          </template>
        </el-table-column>
        <el-table-column prop="max_req" label="总次数" show-overflow-tooltip />
        <el-table-column
          prop="max_req_per_uri"
          label="单URL最大次数"
          show-overflow-tooltip
        />
        <el-table-column
          prop="create_at2"
          label="创建时间"
          show-overflow-tooltip
        />
        <el-table-column label="启用" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.enable === 1 ? "已开启" : "未开启" }}
          </template>
        </el-table-column>
        <el-table-column label="配置同步" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.state === null ? "已完成" : "未完成" }}
          </template>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button size="small" type="primary" @click="handleEdit(row)"
              >修改</el-button
            >
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

    <el-dialog
      v-model="modal"
      :title="`${tabList.find(i => i.value === currentTab).label}`"
      append-to-body
    >
      <el-form
        v-if="currentTab === 'rule'"
        :model="filterFormData"
        label-width="150"
        label-position="left"
      >
        <el-form-item label="名称">
          <el-input v-model="formData.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="formData.sort" style="width: 220px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.des" style="width: 220px" />
        </el-form-item>
        <el-form-item label="显示">
          <el-switch v-model="formData.is_show" />
        </el-form-item>
        <el-form-item label="规则">
          <div class="space-y-4 w-full">
            <el-button
              size="small"
              type="primary"
              @click="
                async () => {
                  ruleModal = true;
                  ({ data: matcherList } = await getCCMatchList({ limit: 0 }));
                  ({ data: filterList } = await getCCFilterList({
                    limit: 0
                  }));
                }
              "
            >
              新增
            </el-button>
            <el-table border size="small" :data="ruleList" class="w-full">
              <el-table-column
                label="匹配器"
                prop="matcher_name"
                show-overflow-tooltip
              />
              <el-table-column
                label="过滤器1"
                prop="filter1_name"
                show-overflow-tooltip
              />
              <el-table-column
                label="过滤器2"
                prop="filter2_name"
                show-overflow-tooltip
              />
              <el-table-column
                label="动作"
                prop="action"
                show-overflow-tooltip
              />
              <el-table-column label="启用" show-overflow-tooltip>
                <template #default="{ row }">
                  {{ row.state ? "已启用" : "未启用" }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="{ $index }">
                  <el-button
                    size="small"
                    type="danger"
                    @click="ruleList.splice($index, 1)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <el-form
        v-if="currentTab === 'matcher'"
        :model="filterFormData"
        label-width="150"
        label-position="left"
      >
        <el-form-item label="名称">
          <el-input v-model="matcherFormData.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="matcherFormData.des" style="width: 220px" />
        </el-form-item>
        <el-form-item label="规则">
          <div class="space-y-4 w-full">
            <el-button
              size="small"
              type="primary"
              @click="matcherRuleModal = true"
              >新增</el-button
            >
            <el-table
              border
              size="small"
              :data="matcherRuleList"
              class="w-full"
            >
              <el-table-column
                label="匹配项"
                prop="name"
                show-overflow-tooltip
              />
              <el-table-column
                label="操作符"
                prop="operator"
                show-overflow-tooltip
              />
              <el-table-column label="匹配值" show-overflow-tooltip>
                <template #default="{ row }">
                  <div
                    v-for="(item, index) of row.value?.split('/n') || []"
                    :key="index"
                  >
                    {{ item }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="{ $index }">
                  <el-button
                    size="small"
                    type="danger"
                    @click="matcherRuleList.splice($index, 1)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
      <el-form
        v-if="currentTab === 'filter'"
        :model="filterFormData"
        label-width="150"
        label-position="left"
      >
        <el-form-item label="名称">
          <el-input v-model="filterFormData.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="filterFormData.des" style="width: 220px" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="filterFormData.type" style="width: 220px">
            <el-option
              v-for="item of ccFilterList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="n秒内">
          <el-input
            v-model="filterFormData.within_second"
            style="width: 220px"
          />
        </el-form-item>
        <el-form-item label="最大失败次数">
          <el-input v-model="filterFormData.max_req" style="width: 220px" />
        </el-form-item>
        <el-form-item
          v-if="filterFormData.type === 'req_rate'"
          label="单URL最大次数"
        >
          <el-input
            v-model="filterFormData.max_req_per_uri"
            style="width: 220px"
          />
        </el-form-item>
        <template v-if="filterFormData.type === 'url_auth'">
          <el-form-item label="鉴权方式">
            <el-radio-group v-model="filterFormData.extra.mode">
              <el-radio label="TypeA" value="TypeA" />
              <el-radio label="TypeB" value="TypeB" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密钥(16-32位)">
            <el-input v-model="filterFormData.extra.key" style="width: 220px" />
          </el-form-item>
          <el-form-item label="签名参数名">
            <el-input
              v-model="filterFormData.extra.sign_name"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item
            v-if="filterFormData.extra.mode === 'TypeA'"
            label="时间戳参数名"
          >
            <el-input
              v-model="filterFormData.extra.time_name"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="最大时间相差(秒)">
            <el-input
              v-model="filterFormData.extra.time_diff"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="签名使用次数">
            <el-input
              v-model="filterFormData.extra.sign_use_times"
              style="width: 220px"
            />
          </el-form-item>
        </template>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="matcherRuleModal" title="添加匹配规则" append-to-body>
      <el-form
        label-width="100"
        label-position="left"
        :model="matcherRuleFormData"
      >
        <el-form-item label="匹配项">
          <el-select v-model="matcherRuleFormData.name" style="width: 220px">
            <el-option
              v-for="item of aclMatchList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="操作符">
          <el-select
            v-model="matcherRuleFormData.operator"
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
        </el-form-item>
        <el-form-item label="匹配值">
          <el-input
            v-model="matcherRuleFormData.value"
            type="textarea"
            placeholder="一行一个匹配值，可为空"
            :rows="3"
            style="width: 220px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              matcherRuleList.push(matcherRuleFormData);
              matcherRuleFormData = {};
              matcherRuleModal = false;
            }
          "
        >
          提交
        </el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="ruleModal" title="新增规则组" append-to-body>
      <el-form label-width="100" label-position="left" :model="ruleFormData">
        <el-form-item label="匹配器">
          <el-select v-model="ruleFormData.matcher" style="width: 220px">
            <el-option
              v-for="item of matcherList"
              :key="item.id"
              :label="item.name"
              :value="{ id: item.id, name: item.name }"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="过滤器1">
          <el-select v-model="ruleFormData.filter1" style="width: 220px">
            <el-option
              v-for="item of filterList"
              :key="item.id"
              :label="item.name"
              :value="{ id: item.id, name: item.name }"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="过滤器2(可选)">
          <el-select v-model="ruleFormData.filter2" style="width: 220px">
            <el-option
              v-for="item of filterList.filter(
                i => i.id !== ruleFormData.filter1?.id
              )"
              :key="item.id"
              :label="item.name"
              :value="{ id: item.id, name: item.name }"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="动作">
          <el-select v-model="ruleFormData.action" style="width: 220px">
            <el-option label="ipset" value="ipset" />
            <el-option label="exit" value="exit" />
            <el-option label="log" value="log" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="ruleFormData.state" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              ruleList.push({
                ...ruleFormData,
                filter1: ruleFormData.filter1.id,
                filter1_name: ruleFormData.filter1.name,
                filter2: ruleFormData.filter2?.id,
                filter2_name: ruleFormData.filter2?.name,
                matcher: ruleFormData.matcher.id,
                matcher_name: ruleFormData.matcher.name
              });
              ruleFormData = {
                state: true
              };
              ruleModal = false;
            }
          "
        >
          提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
