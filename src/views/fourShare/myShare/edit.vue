<script setup>
import Label from "@/components/Label/index.vue";
import { onMounted, ref } from "vue";
import {
  getFourShareDetail,
  getFourShareGroup,
  editFourShare
} from "@/api/fourShare";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { regionList } from "@/model";

const route = useRoute();
const router = useRouter();
const groupList = ref([]);
const formData = ref({
  acl: {
    default_action: ""
  }
});

const listenList = ref([]);
const listenFormData = ref({});

const backendList = ref([]);
const backendModal = ref(false);
const backendFormData = ref({});

const aclRuleList = ref([]);
const aclRuleFormData = ref({});
const aclRuleModal = ref(false);

const submit = async () => {
  const {
    groups,
    des,
    balance_way,
    backend_port,
    proxy_protocol,
    block_region
  } = formData.value;
  const data = {
    groups: groups.toString(),
    des,
    listen: listenList.value,
    balance_way,
    backend_port,
    proxy_protocol: +proxy_protocol,
    backend: backendList.value,
    block_region,
    acl: {
      ...formData.value.acl,
      rule: aclRuleList.value
    }
  };
  await editFourShare(route.query.id, data);
  ElMessage.success("修改成功");
  router.back();
};

onMounted(async () => {
  const { data } = await getFourShareDetail(route.query.id);
  formData.value = {
    ...data,
    groups: data.groups.split(","),
    proxy_protocol: !data.proxy_protocol,
    acl: JSON.parse(data.acl)
  };
  listenList.value = JSON.parse(data.listen);
  backendList.value = JSON.parse(data.backend);
  aclRuleList.value = formData.value.acl.rule || [];
  ({ data: groupList.value } = await getFourShareGroup({ limit: 0 }));
});
</script>

<template>
  <div class="rounded-xl bg-white p-4">
    <el-form
      :model="formData"
      class="space-y-4"
      label-width="200"
      label-position="left"
    >
      <Label value="基本信息" />
      <el-form-item label="启用">
        {{ formData.enable === 1 ? "已开启" : "未开启" }}
      </el-form-item>
      <el-form-item label="配置同步">
        {{ formData.sync_state === "done" ? "已完成" : "未完成" }}
      </el-form-item>
      <el-form-item label="CNAME">
        {{ `${formData.cname_hostname}${formData.cname_domain}` }}
      </el-form-item>
      <el-form-item label="套餐">
        {{ `${formData.user_package}(${formData.end_at}到期)` }}
      </el-form-item>
      <el-form-item label="所属分组">
        <el-select v-model="formData.groups" multiple>
          <el-option
            v-for="item of groupList"
            :key="item.id"
            :value="item.id"
            :label="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="formData.des" />
      </el-form-item>
      <el-form-item label="创建时间">
        {{ formData.create_at2 }}
      </el-form-item>
      <el-form-item label="更新时间">
        {{ formData.update_at2 }}
      </el-form-item>
      <Label value="监听设置" />
      <el-form-item label="监听端口">
        <div class="space-y-4">
          <div class="flex items-center gap-x-4">
            <el-tag
              v-for="(item, index) in listenList"
              :key="index"
              closable
              type="primary"
            >
              {{ `${item.port}/${item.protocol}` }}
            </el-tag>
          </div>
          <div class="flex items-center gap-x-4">
            <el-input v-model="listenFormData.port" placeholder="端口" />
            <el-select v-model="listenFormData.protocol" placeholder="协议">
              <el-option label="TCP" value="tcp" />
              <el-option label="UDP" value="udp" />
            </el-select>
            <el-button
              type="primary"
              @click="
                () => {
                  listenList.push(listenFormData);
                  listenFormData = {};
                }
              "
            >
              添加
            </el-button>
          </div>
        </div>
      </el-form-item>
      <Label value="源站设置" />
      <el-form-item label="负载方式">
        <el-select v-model="formData.balance_way">
          <el-option label="轮询" value="rr" />
          <el-option label="ip_hash" value="ip_hash" />
        </el-select>
      </el-form-item>
      <el-form-item label="回源端口">
        <el-input v-model="formData.backend_port" />
      </el-form-item>
      <el-form-item label="Proxy Protocol">
        <el-switch v-model="formData.proxy_protocol" />
      </el-form-item>
      <el-form-item label="源站列表">
        <div class="space-y-4 w-full">
          <el-button size="small" type="primary" @click="backendModal = true"
            >新增</el-button
          >
          <el-table border size="small" :data="backendList">
            <el-table-column prop="addr" label="源站" show-overflow-tooltip />
            <el-table-column prop="weight" label="权重" show-overflow-tooltip />
            <el-table-column label="状态">
              <template #default="{ row }">
                {{
                  row.state === "up"
                    ? "上线"
                    : row.state === "down"
                      ? "下线"
                      : "备用"
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ $index }">
                <el-button
                  size="small"
                  type="danger"
                  @click="backendList.splice($index, 1)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <Label value="区域屏蔽" />
      <el-form-item label="屏蔽设置">
        <el-radio-group v-model="formData.block_region">
          <el-radio
            v-for="item of regionList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-radio-group>
      </el-form-item>
      <Label value="ACL" />
      <el-form-item label="默认行为">
        <el-radio-group v-model="formData.acl.default_action">
          <el-radio label="允许" value="allow" />
          <el-radio label="拒绝" value="deny" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="规则">
        <div class="space-y-4">
          <el-button size="small" type="primary" @click="aclRuleModal = true"
            >新增</el-button
          >
          <el-table border size="small" :data="aclRuleList">
            <el-table-column prop="ip" label="IP" show-overflow-tooltip />
            <el-table-column prop="action" label="行为" show-overflow-tooltip />
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

      <el-form-item>
        <el-button type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>

    <el-dialog v-model="backendModal" title="添加源站">
      <el-form label-width="100" label-position="left" :model="backendFormData">
        <el-form-item label="源IP">
          <el-input v-model="backendFormData.addr" placeholder="1.2.3.4" />
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="backendFormData.weight" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="backendFormData.state">
            <el-option label="上线" value="up" />
            <el-option label="下线" value="down" />
            <el-option label="备用" value="backend" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              backendList.push(backendFormData);
              backendFormData = {};
              backendModal = false;
            }
          "
        >
          提交
        </el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="aclRuleModal" title="添加ACL规则">
      <el-form label-width="100" label-position="left" :model="aclRuleFormData">
        <el-form-item label="IP">
          <el-input
            v-model="aclRuleFormData.ip"
            placeholder="192.168.0.100或192.168.0.0/24"
          />
        </el-form-item>
        <el-form-item label="行为">
          <el-radio-group v-model="aclRuleFormData.action">
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
              aclRuleList.push(aclRuleFormData);
              aclRuleFormData = {};
              aclRuleModal = false;
            }
          "
        >
          提交
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>
<style scoped>
:deep(.el-input),
:deep(.el-select) {
  width: 220px;
}
</style>
