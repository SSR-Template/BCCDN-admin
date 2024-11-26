<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import {
  getSiteList,
  createSite,
  updateSite,
  editSite,
  deleteSite,
  getSiteGroupList,
  certSite,
  clearSite
} from "@/api/console";
import { getMyPackageList } from "@/api/package";

const router = useRouter();
const isLoading = ref(false);
const isExpendSearch = ref(false);
const searchForm = reactive({});
const siteGroupList = ref([]);
const packageList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);
const getList = async () => {
  const { count, data } = await getSiteList({
    ...pagination,
    ...searchForm
  });
  tableData.value = data;
  pagination.count = count;
};

const createModal = ref(false);
const createRadio = ref("single");
const isExpendCreate = ref(false);
const createFormRef = ref(null);
const createForm = reactive({});
const createFormRules = reactive({
  user_package: [{ required: true, message: "请选择套餐", trigger: "change" }],
  domain: [{ required: true, message: "请输入域名", trigger: "change" }],
  backend: [{ required: true, message: "请输入源地址", trigger: "change" }]
});
const handleCreateSubmit = async () => {
  await createFormRef.value.validate(async valid => {
    if (valid) {
      const tasks = [];
      if (createRadio.value === "batch") {
        const backends = createForm.backend.split("\n");
        backends.forEach(item => {
          tasks.push(
            createSite({
              user_package: createForm.user_package,
              groups: createForm.groups.toString(),
              backend: [{ addr: item.split("|")[1].split(":")[0] }],
              backend_http_port: item.split("|")[1].split(":")[1] || "80",
              domain: item.split("|")[0].split(":")[0],
              http_listen: { port: item.split("|")[0].split(":")[1] || "80" }
            })
          );
        });
      } else {
        tasks.push(
          createSite({
            user_package: createForm.user_package,
            groups: createForm.groups.toString(),
            backend: [{ addr: createForm.backend.split(":")[0] }],
            backend_http_port: createForm.backend.split(":")[1] || "80",
            domain: createForm.domain.split(":")[0],
            http_listen: { port: createForm.domain.split(":")[1] || "80" }
          })
        );
      }
      await Promise.all(tasks);
      ElMessage.success("创建成功");
      createModal.value = false;
      getList();
    }
  });
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (type === "update") {
    router.push({
      path: "/console/site-update",
      query: {
        ids: selection.value.map(i => i.id),
        domains: selection.value.map(i => i.domain)
      }
    });
    return;
  }

  if (["enable", "disable"].includes(type)) {
    await Promise.all(
      selection.value.map(i =>
        updateSite({
          id: i.id,
          enable: type === "enable" ? 1 : 0
        })
      )
    );
  }

  if (type === "delete") {
    await Promise.all(selection.value.map(i => deleteSite(i.id)));
  }

  if (type === "cert") {
    const certList = await Promise.all(
      selection.value.map(i =>
        certSite({
          des: "一键申请",
          domain: i.domain,
          name: `${i.domain}免费证书`
        })
      )
    );
    await Promise.all(
      certList.map(i =>
        editSite(i.id, {
          https_listen: { cert: i.data }
        })
      )
    );
  }

  if (type === "clear") {
    await Promise.all(
      selection.value.map(i =>
        clearSite({
          data: { url: `http://${i.domain}/` },
          type: "clean_dir"
        })
      )
    );
    await Promise.all(
      selection.value.map(i =>
        clearSite({
          data: { url: `https://${i.domain}/` },
          type: "clean_dir"
        })
      )
    );

    ElMessageBox.alert(
      "已发送清理缓存请求，请等待一分钟左右完成清理任务",
      "信息",
      {
        confirmButtonText: "好的"
      }
    );
  }

  ElMessage.success("操作成功");
  getList();
};

const handleDelete = async id => {
  await deleteSite({ id });
  ElMessage.success("删除成功");
  getList();
};

onMounted(async () => {
  isLoading.value = true;
  try {
    ({ data: siteGroupList.value } = await getSiteGroupList({ limit: 0 }));
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
        v-model="searchForm.domain"
        placeholder="搜索域名/别名(模糊搜索)"
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
    <div v-show="isExpendSearch" class="flex gap-x-4">
      <el-input
        v-model="searchForm.domains"
        type="textarea"
        :rows="3"
        placeholder="多域名(一行一个域名 精确搜索)"
        style="width: 800px"
      />
      <div class="flex flex-wrap items-center gap-4">
        <el-input
          v-model="searchForm.backend_ip"
          placeholder="源服务器IP"
          style="width: 220px"
        />
        <el-select
          v-model="searchForm.group"
          placeholder="网站组"
          style="width: 220px"
        >
          <el-option
            v-for="item of siteGroupList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="searchForm.id"
          placeholder="网站ID"
          style="width: 220px"
        />
        <el-select
          v-model="searchForm.user_package"
          placeholder="网站套餐"
          style="width: 220px"
        >
          <el-option
            v-for="item of packageList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-input
          v-model="searchForm.http_listen_port"
          placeholder="HTTP监听端口"
          style="width: 220px"
        />
        <el-input
          v-model="searchForm.https_listen_port"
          placeholder="HTTPS监听端口"
          style="width: 220px"
        />
        <el-select
          v-model="searchForm.https_enable"
          placeholder="HTTPS启用"
          style="width: 220px"
        >
          <el-option label="不限" value="" />
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
        <el-select
          v-model="searchForm.enable"
          placeholder="站点启用"
          style="width: 220px"
        >
          <el-option label="不限" value="" />
          <el-option label="是" :value="true" />
          <el-option label="否" :value="false" />
        </el-select>
        <el-select
          v-model="searchForm.state"
          placeholder="站点状态"
          style="width: 220px"
        >
          <el-option label="正常" value="200" />
          <el-option label="套餐过期" value="512" />
          <el-option label="流量超限" value="513" />
          <el-option label="锁定" value="514" />
        </el-select>
      </div>
    </div>
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-button size="small" type="success" @click="createModal = true"
          >新增</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleBatchOption('update')"
          >修改
        </el-button>
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
        <el-button
          size="small"
          type="primary"
          @click="handleBatchOption('cert')"
          >申请证书</el-button
        >
        <el-button size="small" type="success">解锁黑名单</el-button>
        <el-button
          size="small"
          type="success"
          @click="handleBatchOption('clear')"
          >清空缓存</el-button
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
      <el-table-column prop="package_name" label="套餐" show-overflow-tooltip />
      <el-table-column prop="group_name" label="分组" show-overflow-tooltip />
      <el-table-column label="域名" show-overflow-tooltip>
        <template #default="{ row }">
          {{ JSON.parse(row.http_listen)?.port }}
        </template>
      </el-table-column>
      <el-table-column label="监听端口" show-overflow-tooltip>
        <template #default="{ row }">
          {{ `${row.backend_http_port} ${row.backend_https_port}s` }}
        </template>
      </el-table-column>
      <el-table-column label="源IP" show-overflow-tooltip>
        <template #default="{ row }">
          {{ JSON.parse(row.backend)?.addr }}
        </template>
      </el-table-column>
      <el-table-column
        prop="cname_hostname"
        label="CNAME"
        show-overflow-tooltip
      />
      <el-table-column label="HTTPS" show-overflow-tooltip>
        <template #default="{ row }">
          {{
            Object.keys(JSON.parse(row.https_listen)).length
              ? "已开启"
              : "未开启"
          }}
        </template>
      </el-table-column>
      <el-table-column
        prop="create_at2"
        label="添加时间"
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
      <el-table-column label="站点状态" show-overflow-tooltip>
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
                  path: '/console/site-edit',
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

    <el-dialog v-model="createModal" title="新增网站" append-to-body>
      <div class="space-y-4">
        <div
          class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
        >
          数量
        </div>
        <el-radio-group v-model="createRadio">
          <el-radio value="single">单个</el-radio>
          <el-radio value="batch">批量</el-radio>
        </el-radio-group>
        <el-form
          ref="createFormRef"
          :model="createForm"
          :rules="createFormRules"
          label-width="100"
          label-position="left"
        >
          <el-form-item label="套餐" prop="user_package">
            <el-select v-model="createForm.user_package">
              <el-option
                v-for="item of packageList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="所属分组">
            <el-select v-model="createForm.groups" multiple>
              <el-option
                v-for="item of siteGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <template v-if="createRadio === 'single'">
            <el-form-item label="域名" prop="domain">
              <el-input
                v-model="createForm.domain"
                placeholder="www.abc.com www.abc.com:80 abc.com:80"
              />
            </el-form-item>
            <el-form-item label="源地址" prop="backend">
              <el-input
                v-model="createForm.backend"
                placeholder="1.1.1.1或1.2.3.4:80或www.abc.com:80"
              />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="数据" prop="backend">
              <el-input
                v-model="createForm.backend"
                type="textarea"
                :rows="5"
                placeholder="格式为：域名:监听端口|IP:回源端口，不加端口默认为80
www.abc.com:80 abc.com:80|1.2.3.4:8080
www.qq.com qq.com|8.8.8.8"
              />
            </el-form-item>
          </template>
          <div
            class="flex items-center justify-end gap-x-4 my-4"
            @click="isExpendCreate = !isExpendCreate"
          >
            更多选项
            <el-icon>
              <ArrowUp v-if="isExpendCreate" />
              <ArrowDown v-else />
            </el-icon>
          </div>
          <el-form-item v-if="isExpendCreate" label="DNS API">
            <el-select placeholder="请选择，可自动为域名添加CNAME记录">
              <el-option />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <el-button type="primary" @click="handleCreateSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
