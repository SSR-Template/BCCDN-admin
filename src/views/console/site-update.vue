<script setup>
import { ElMessage } from "element-plus";
import { ref, reactive, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSiteGroupList, getCertList, updateSite } from "@/api/console";
import { getMyPackageList } from "@/api/package";

const route = useRoute();
const router = useRouter();
const siteGroupList = ref([]);
const packageList = ref([]);
const certList = ref([]);
const sslRadio = ref("");
const formData = reactive({
  enableHttp: false,
  enableHttps: false,
  http_listen: {},
  https_listen: {
    ssl_protocols: "LSv1 TLSv1.1 TLSv1.2 TLSv1.3",
    ssl_ciphers:
      "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA",
    ssl_prefer_server_ciphers: "on",
    force_ssl_port: "443"
  },
  proxy_cache: []
});

watch(sslRadio, val => {
  if (val === "old") {
    formData.https_listen.ssl_protocols = "LSv1 TLSv1.1 TLSv1.2 TLSv1.3";
    formData.https_listen.ssl_ciphers =
      "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA";
    formData.https_listen.ssl_prefer_server_ciphers = "on";
  } else if (val === "partly") {
    formData.https_listen.ssl_protocols = "TLSv1.2 TLSv1.3";
    formData.https_listen.ssl_ciphers =
      "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
    formData.https_listen.ssl_prefer_server_ciphers = "off";
  }
});

const cacheModal = ref(false);
const cacheForm = reactive({});
const cacheRuleList = ref([]);
const cacheRuleForm = reactive({
  variable: "",
  string: ""
});
const saveCache = () => {
  formData.proxy_cache.push({
    ...cacheForm,
    no_cache: cacheRuleList.value,
    proxy_ignore_headers: cacheForm.proxy_ignore_headers.join(" ")
  });
  cacheModal.value = false;
};

onMounted(async () => {
  ({ data: siteGroupList.value } = await getSiteGroupList({ limit: 0 }));
  ({ data: packageList.value } = await getMyPackageList({ limit: 0 }));
  ({ data: certList.value } = await getCertList({ limit: 0, valid: 1 }));
});

const handleSubmit = async () => {
  await updateSite({
    ...formData,
    https_listen: formData.enableHttps ? formData.https_listen : undefined,
    http_listen: formData.enableHttp ? formData.http_listen : undefined
  });
  ElMessage.success("修改成功");
  router.back();
};
</script>

<template>
  <div class="bg-white rounded-md p-4 space-y-4">
    <div
      class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
    >
      正在修改的网站：
    </div>
    <div>{{ route.query.domains.toString() }}</div>
    <el-form label-position="left" label-width="150">
      <div class="space-y-4">
        <div
          class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
        >
          基本设置
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))]">
          <el-form-item label="分组设置">
            <el-select
              v-model="formData.groups"
              multiple
              placeholder="请选择分组"
              style="width: 200px"
            >
              <el-option
                v-for="item of siteGroupList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="套餐设置">
            <el-select
              v-model="formData.user_package"
              placeholder="请选择套餐"
              style="width: 200px"
            >
              <el-option
                v-for="item of packageList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="DNS_API">
            <el-select
              v-model="formData.dns_api"
              placeholder="请选择DNS API"
              style="width: 200px"
            />
          </el-form-item>
        </div>
        <div
          class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
        >
          HTTP设置
        </div>
        <div class="grid grid-cols-[repeat(auto-fill,minmax(500px,1fr))]">
          <el-form-item label="状态设置">
            <el-switch v-model="formData.enableHttp" />
          </el-form-item>
          <el-form-item v-if="formData.enableHttp" label="监听端口">
            <el-input
              v-model="formData.http_listen.port"
              placeholder="请输入端口"
              style="width: 200px"
            />
          </el-form-item>
        </div>
        <div
          class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
        >
          HTTPS设置
        </div>
        <div class="space-y-4">
          <el-form-item label="状态设置">
            <el-switch v-model="formData.enableHttps" />
          </el-form-item>
          <template v-if="formData.enableHttps">
            <el-form-item label="证书">
              <el-select
                v-model="formData.https_listen.cert"
                style="width: 200px"
              >
                <el-option
                  v-for="item of certList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="监听端口">
              <el-input
                v-model="formData.https_listen.port"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="HSTS">
              <el-radio-group v-model="formData.https_listen.hsts">
                <el-radio label="开启" :value="0" />
                <el-radio label="关闭" :value="1" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="HTTP2">
              <el-radio-group v-model="formData.https_listen.http2">
                <el-radio label="开启" :value="0" />
                <el-radio label="关闭" :value="1" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="HTTP3">
              <el-radio-group v-model="formData.https_listen.http3">
                <el-radio label="开启" :value="0" />
                <el-radio label="关闭" :value="1" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="SSL配置">
              <el-radio-group v-model="sslRadio">
                <el-radio value="old" label="兼容旧浏览器(安全性降低)" />
                <el-radio value="partly" label="兼容大部分浏览器(更安全)" />
                <el-radio value="custom" label="自定义" />
              </el-radio-group>
            </el-form-item>
            <template v-if="sslRadio === 'custom'">
              <el-form-item label="ssl_protocols">
                <el-input v-model="formData.https_listen.ssl_protocols" />
              </el-form-item>
              <el-form-item label="ssl_ciphers">
                <el-input
                  v-model="formData.https_listen.ssl_ciphers"
                  type="textarea"
                  :rows="5"
                />
              </el-form-item>
              <el-form-item label="ssl_prefer_server_ciphers">
                <el-input
                  v-model="formData.https_listen.ssl_prefer_server_ciphers"
                />
              </el-form-item>
            </template>
            <el-form-item label="强制HTTPS">
              <el-radio-group v-model="formData.https_listen.force_ssl_enable">
                <el-radio label="开启" :value="0" />
                <el-radio label="关闭" :value="1" />
              </el-radio-group>
            </el-form-item>
            <el-form-item label="强制HTTPS端口">
              <el-input
                v-model="formData.https_listen.force_ssl_port"
                style="width: 200px"
              />
            </el-form-item>
            <el-form-item label="OCSP stapling">
              <el-radio-group v-model="formData.https_listen.ocsp_stapling">
                <el-radio label="开启" :value="0" />
                <el-radio label="关闭" :value="1" />
              </el-radio-group>
            </el-form-item>
          </template>
        </div>
        <div
          class="pl-3 border-l-4 border-[var(--el-color-primary)] text-sm font-bold"
        >
          缓存配置
        </div>
        <div class="flex items-center">
          <el-button size="small" type="success" @click="cacheModal = true"
            >新增</el-button
          >
        </div>
        <el-table size="small" border :data="formData.proxy_cache">
          <el-table-column label="类型">
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
              <el-button
                size="small"
                type="danger"
                @click="formData.proxy_cache.splice($index, 1)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <el-button type="primary" @click="handleSubmit">保存</el-button>

    <el-dialog v-model="cacheModal" title="新增缓存" append-to-body>
      <el-form :model="cacheForm" label-width="100" label-position="left">
        <el-form-item label="类型">
          <el-select v-model="cacheForm.type" style="width: 200px">
            <el-option label="后缀名" value="suffix" />
            <el-option label="目录" value="dir" />
            <el-option label="全路径" value="full_path" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="cacheForm.content"
            placeholder="多个用|分割"
            style="width: 200px"
          />
        </el-form-item>
        <div class="flex gap-x-4">
          <el-form-item label="有效期">
            <el-input v-model="cacheForm.expire" style="width: 200px" />
          </el-form-item>
          <el-form-item label-width="0">
            <el-select
              v-model="cacheForm.unit"
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
          <el-switch v-model="cacheForm.ignore_arg" />
        </el-form-item>
        <el-form-item label="忽略响应头">
          <el-checkbox-group v-model="cacheForm.proxy_ignore_headers">
            <el-checkbox label="X-Accel-Expires" value="X-Accel-Expires" />
            <el-checkbox label="Expires" value="Expires" />
            <el-checkbox label="Cache-Control" value="Cache-Control" />
            <el-checkbox label="Set-Cookie" value="Set-Cookie" />
            <el-checkbox label="Vary" value="Vary" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="分片回源">
          <el-switch v-model="cacheForm.range" />
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
        <el-button type="primary" @click="saveCache">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
