<script setup>
import { ElMessage } from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getFourShareList,
  getFourShareGroup,
  createFourShare,
  optionFourShare,
  deleteFourShare
} from "@/api/fourShare";
import { getMyPackageList } from "@/api/package";

const router = useRouter();
const isLoading = ref(false);
const isExpendSearch = ref(false);
const searchForm = reactive({});
const fourShareGroupList = ref([]);
const packageList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getFourShareList({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const createType = ref("single");
const formData = ref({});
const handleCreate = async () => {
  const tasks = [];
  if (createRadio.value === "batch") {
    const backends = formData.value.backend.split("\n");
    backends.forEach(item => {
      tasks.push(
        createFourShare({
          user_package: formData.value.user_package,
          groups: formData.value.groups.toString(),
          backend: [{ addr: item.split("|")[1] }],
          backend_port: item.split("|")[2],
          listen: [
            {
              port: item.split("|")[0].split("/")[0],
              protocol: item.split("|")[0].split("/")[1] || "tcp"
            }
          ]
        })
      );
    });
  } else {
    tasks.push(
      createFourShare({
        user_package: formData.value.user_package,
        groups: formData.value.groups.toString(),
        backend: [{ addr: formData.value.backend.split(":")[0] }],
        backend_port: formData.value.backend.split(":")[1],
        listen: [
          {
            port: formData.value.listen.split("/")[0],
            protocol: formData.value.listen.split("/")[1] || "tcp"
          }
        ],
        des: formData.value.des
      })
    );
  }
  await Promise.all(tasks);
  ElMessage.success("创建成功");
  formData.value = {};
  modal.value = false;
  getList();
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (["enable", "disable"].includes(type)) {
    await Promise.all(
      selection.value.map(i =>
        optionFourShare({
          id: i.id,
          enable: type === "enable" ? 1 : 0
        })
      )
    );
  }

  if (type === "delete") {
    await Promise.all(selection.value.map(i => deleteFourShare(i.id)));
  }

  ElMessage.success("操作成功");
  getList();
};

const handleDelete = async id => {
  await deleteFourShare(id);
  ElMessage.success("删除成功");
  getList();
};

onMounted(async () => {
  isLoading.value = true;
  try {
    ({ data: fourShareGroupList.value } = await getFourShareGroup({
      limit: 0
    }));
    ({ data: packageList.value } = await getMyPackageList({ limit: 0 }));
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
        v-model="searchForm.listen_port"
        placeholder="监听端口"
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
        v-model="searchForm.listen_protocol"
        placeholder="监听协议"
        style="width: 220px"
      >
        <el-option label="TCP" value="tcp" />
        <el-option label="UDP" value="udp" />
      </el-select>
      <el-select
        v-model="searchForm.group"
        placeholder="转发组"
        style="width: 220px"
      >
        <el-option
          v-for="item of fourShareGroupList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-input
        v-model="searchForm.backend_ip"
        placeholder="源IP"
        style="width: 220px"
      />
      <el-input
        v-model="searchForm.id"
        placeholder="转发ID"
        style="width: 220px"
      />
      <el-select
        v-model="searchForm.user_package"
        placeholder="转发套餐"
        style="width: 220px"
      >
        <el-option
          v-for="item of packageList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <el-select
        v-model="searchForm.enable"
        placeholder="启用"
        style="width: 220px"
      >
        <el-option label="是" :value="true" />
        <el-option label="否" :value="false" />
      </el-select>
      <el-select
        v-model="searchForm.state"
        placeholder="状态"
        style="width: 220px"
      >
        <el-option label="正常" value="200" />
        <el-option label="套餐过期" value="512" />
        <el-option label="流量超限" value="513" />
        <el-option label="锁定" value="514" />
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
      <el-table-column prop="backend_port" label="监听" show-overflow-tooltip />
      <el-table-column prop="des" label="备注" show-overflow-tooltip />
      <el-table-column label="套餐" prop="user_package" show-overflow-tooltip />
      <el-table-column
        prop="cname_hostname"
        label="CNAME"
        show-overflow-tooltip
      />
      <el-table-column
        prop="create_at2"
        label="添加时间"
        show-overflow-tooltip
      />
      <el-table-column
        prop="update_at2"
        label="更新时间"
        show-overflow-tooltip
      />
      <el-table-column label="启用" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.enable === 1 ? "已开启" : "未开启" }}
        </template>
      </el-table-column>
      <el-table-column label="配置同步" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.sync_state === "done" ? "已完成" : "未完成" }}
        </template>
      </el-table-column>
      <el-table-column label="转发状态" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.state === "200" ? "正常" : "异常" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-button
              size="small"
              type="primary"
              @click="
                router.push({
                  path: '/fourShare/myshare-edit',
                  query: { id: row.id }
                })
              "
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

    <el-dialog v-model="modal" title="新增转发" append-to-body>
      <div class="space-y-4">
        <div
          class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
        >
          数量
        </div>
        <el-radio-group v-model="createType">
          <el-radio value="single">单个</el-radio>
          <el-radio value="batch">批量</el-radio>
        </el-radio-group>
        <el-form :model="formData" label-width="100" label-position="left">
          <el-form-item label="套餐" prop="user_package">
            <el-select v-model="formData.user_package">
              <el-option
                v-for="item of packageList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属分组">
            <el-select v-model="formData.groups" multiple>
              <el-option
                v-for="item of fourShareGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <template v-if="formData === 'single'">
            <el-form-item label="监听端口" prop="listen">
              <el-input v-model="createForm.listen" placeholder="88 99/udp" />
            </el-form-item>
            <el-form-item label="源地址" prop="backend">
              <el-input
                v-model="createForm.backend"
                placeholder="IP或域名。如1.2.3.4:99"
              />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="createForm.des" />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="数据" prop="backend">
              <el-input
                v-model="formData.backend"
                type="textarea"
                :rows="5"
                placeholder="格式为：监听端口|IP|回源端口
88 99/udp|1.2.3.4|8080
77 66|8.8.8.8|8080"
              />
            </el-form-item>
          </template>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleCreate">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
