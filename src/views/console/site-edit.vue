<script setup>
import Label from "@/components/Label/index.vue";
import { onMounted, ref } from "vue";
import {
  getSiteDetail,
  getSiteGroupList,
  getCertList,
  editSite,
  getCCRuleList,
  getACLList
} from "@/api/console";
import { getMyPackageList } from "@/api/package";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { sslConfigMapping, ccRuleList, regionList } from "@/model";
import Tabs from "@/components/Tabs/index.vue";
import { ArrowDown, ArrowUp } from "@element-plus/icons-vue";

const tabList = [
  {
    label: "基本配置",
    value: "basic"
  },
  {
    label: "缓存配置",
    value: "cache"
  },
  {
    label: "安全配置",
    value: "security"
  },
  {
    label: "访问控制",
    value: "control"
  },
  {
    label: "高级配置",
    value: "advance"
  }
];
const currentTab = ref("basic");

const route = useRoute();
const router = useRouter();
const baseInfo = ref({
  enable: "",
  sync_state: "",
  cname_hostname: "",
  cname_domain: "",
  end_at: "",
  create_at2: "",
  update_at2: ""
});
const formData = ref({
  user_package: "",
  domain: "",
  groups: "",
  http_listen: {},
  https_listen: {},
  health_check: {},
  balance_way: "",
  backend_port_mapping: "",
  backend_protocol: "",
  backend_http_port: "",
  backend_https_port: "",
  backend: [],
  backend_host: "",
  proxy_timeout: "",
  proxy_cache: [],
  cc_default_rule: "10002",
  cc_switch: {},
  // extra_cc_rule: []
  spider_allow: "",
  black_ip: "",
  white_ip: "",
  block_proxy: "",
  block_region: "",
  acl: "",
  hotlink: {},
  cors: {},
  gzip_enable: "",
  websocket_enable: "",
  spider_to_sip: "",
  req_header: [],
  resp_header: [],
  url_rewrite: {},
  acme_proxy_to_orgin: "",
  recv_real_time: "",
  send_real_time: ""
});
const packageList = ref([]);
const groupList = ref([]);
const certList = ref([]);
const ccCustomRuleList = ref([]);
const aclList = ref([]);

const enableHttp = ref(false);
const enableHttps = ref(false);
const isExpendHttpsSetting = ref(false);
const sslConfig = ref("old");

const backendModal = ref(false);
const backendList = ref([]);
const backendFormData = ref({});

const cacheList = ref([]);
const cacheModal = ref(false);
const cacheFormData = ref({
  ignore_arg: false,
  range: false
});
const cacheRuleList = ref([]);
const cacheRuleForm = ref({
  variable: "",
  string: ""
});

const reqHeaderModal = ref(false);
const reqHeaderList = ref([]);
const reqHeaderForm = ref({});

const resHeaderModal = ref(false);
const resHeaderList = ref([]);
const resHeaderForm = ref({});

const urlRedirectModal = ref(false);
const urlRedirectList = ref([]);
const urlRedirectForm = ref({
  host: ".*",
  user_agent: ".*",
  referer: ".*",
  country_code: ".*",
  accept_language: ".*",
  province: ".*",
  city: ".*",
  isp: ".*",
  asnumber: ".*",
  match: ".*",
  redirect: "http://www.baidu.com/",
  code: "301"
});

// const customRuleList = ref([]);
// const customRuleModal = ref(false);
// const customRuleForm = ref({
//   filter: {},
//   matcher: {}
// });
// const customMatchRuleForm = ref({
//   name: "",
//   operator: "",
//   value: ""
// });

const submit = async () => {
  if (!enableHttp.value) {
    formData.value.http_listen = {};
  }
  if (!enableHttps.value) {
    formData.value.https_listen = {};
  } else {
    if (["old", "partly"].includes(sslConfig.value)) {
      formData.value.https_listen = {
        ...formData.value.https_listen,
        ...sslConfigMapping[sslConfig.value]
      };
    }
  }
  if (formData.value.cc_switch.enable) {
    formData.value.cc_switch.enable = Number(formData.value.cc_switch.enable);
  }

  await editSite(route.query.id, {
    ...formData.value,
    backend: backendList.value,
    proxy_cache: cacheList.value,
    url_rewrite: urlRedirectList.value,
    resp_header: resHeaderList.value,
    req_header: reqHeaderList.value
  });
  ElMessage.success("修改成功");
  router.back();
};

onMounted(async () => {
  const { data } = await getSiteDetail(route.query.id);
  Object.keys(baseInfo.value).forEach(i => (baseInfo.value[i] = data[i]));
  Object.keys(formData.value).forEach(i => {
    if (
      [
        "http_listen",
        "https_listen",
        "backend",
        "health_check",
        "proxy_cache",
        "cc_switch",
        // "extra_cc_rule"
        "hotlink",
        "cors",
        "url_rewrite",
        "resp_header",
        "req_header"
      ].includes(i)
    ) {
      formData.value[i] = JSON.parse(data[i]);
    } else if (i === "cc_default_rule") {
      formData.value[i] = String(data[i]);
    } else {
      formData.value[i] = data[i];
    }
  });
  enableHttp.value = data.http_listen !== "{}";
  enableHttps.value = data.https_listen !== "{}";

  const { cert, ssl_ciphers, ssl_prefer_server_ciphers, ssl_protocols } =
    formData.value.https_listen;
  if (cert) {
    formData.value.https_listen.cert = Number(cert);
  }
  if (ssl_ciphers && ssl_prefer_server_ciphers && ssl_protocols) {
    const item = Object.entries(sslConfigMapping).find(
      ([_, v]) =>
        v.ssl_ciphers === ssl_ciphers &&
        v.ssl_prefer_server_ciphers === ssl_prefer_server_ciphers &&
        v.ssl_protocols === ssl_protocols
    );
    sslConfig.value = item?.[0] || "custom";
  }

  if (formData.value.backend.length) {
    backendList.value = formData.value.backend.slice();
  }

  if (formData.value.proxy_cache.length) {
    cacheList.value = formData.value.proxy_cache.slice();
  }

  // if (formData.value.extra_cc_rule.length) {
  //   customRuleList.value = formData.value.extra_cc_rule.slice();
  // }

  if (formData.value.url_rewrite.length) {
    urlRedirectList.value = formData.value.url_rewrite.slice();
  }

  if (formData.value.resp_header.length) {
    resHeaderList.value = formData.value.resp_header.slice();
  }

  if (formData.value.req_header.length) {
    reqHeaderList.value = formData.value.req_header.slice();
  }

  ({ data: packageList.value } = await getMyPackageList({ limit: 0 }));
  ({ data: groupList.value } = await getSiteGroupList({ limit: 0 }));
  ({ data: certList.value } = await getCertList({ limit: 0 }));
  ({ data: ccCustomRuleList.value } = await getCCRuleList({ limit: 0 }));
  ({ data: aclList.value } = await getACLList({ limit: 0 }));
});
</script>

<template>
  <div class="rounded-xl bg-white p-4">
    <Tabs v-model="currentTab" :tabs="tabList" />
    <el-form
      :model="formData"
      class="space-y-4 mt-4"
      label-width="200"
      label-position="left"
    >
      <template v-if="currentTab === 'basic'">
        <Label value="基本信息" />
        <el-form-item label="启用">
          {{ baseInfo.enable === 1 ? "是" : "否" }}
        </el-form-item>
        <el-form-item label="配置同步">
          {{ baseInfo.sync_state === "done" ? "是" : "否" }}
        </el-form-item>
        <el-form-item label="CNAME">
          {{ `${baseInfo.cname_hostname}.${baseInfo.cname_domain}` }}
        </el-form-item>
        <el-form-item label="套餐到期">
          {{ baseInfo.end_at }}
        </el-form-item>
        <el-form-item label="创建时间">
          {{ baseInfo.create_at2 }}
        </el-form-item>
        <el-form-item label="更新时间">
          {{ baseInfo.update_at2 }}
        </el-form-item>
        <Label value="基本设置" />
        <el-form-item label="套餐">
          <el-select v-model="formData.user_package" style="width: 220px">
            <el-option
              v-for="item of packageList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="域名">
          <el-input v-model="formData.domain" style="width: 220px" />
        </el-form-item>
        <el-form-item label="所属分组">
          <el-select v-model="formData.groups" style="width: 220px">
            <el-option
              v-for="item of groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <Label value="HTTP设置" />
        <el-switch v-model="enableHttp" />
        <el-form-item v-if="enableHttp" label="监听端口">
          <el-input v-model="formData.http_listen.port" style="width: 220px" />
        </el-form-item>
        <Label value="HTTPS设置" />
        <el-switch v-model="enableHttps" />
        <template v-if="enableHttps">
          <el-form-item label="证书">
            <el-select
              v-model="formData.https_listen.cert"
              style="width: 220px"
            >
              <el-option
                v-for="item of certList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-button
            type="primary"
            @click="isExpendHttpsSetting = !isExpendHttpsSetting"
          >
            更多设置
            <el-icon class="ml-2">
              <ArrowUp v-if="isExpendHttpsSetting" />
              <ArrowDown v-else />
            </el-icon>
          </el-button>
          <template v-if="isExpendHttpsSetting">
            <el-form-item label="监听端口">
              <el-input
                v-model="formData.https_listen.port"
                style="width: 220px"
              />
            </el-form-item>
            <el-form-item label="HSTS">
              <el-switch v-model="formData.https_listen.hsts" />
            </el-form-item>
            <el-form-item label="HTTP2">
              <el-switch v-model="formData.https_listen.http2" />
            </el-form-item>
            <el-form-item label="HTTP3">
              <el-switch v-model="formData.https_listen.http3" />
            </el-form-item>
            <el-form-item label="HTTP3">
              <el-switch v-model="formData.https_listen.http3" />
            </el-form-item>
            <div class="flex items-center gap-x-4">
              <el-form-item label="强制HTTPS">
                <el-switch v-model="formData.https_listen.force_ssl_enable" />
              </el-form-item>
              <el-form-item
                v-if="formData.https_listen.force_ssl_enable"
                label="跳转端口"
              >
                <el-input
                  v-model="formData.https_listen.force_ssl_port"
                  style="width: 220px"
                />
              </el-form-item>
            </div>
            <el-form-item label="OCSP stapling">
              <el-switch v-model="formData.https_listen.ocsp_stapling" />
            </el-form-item>
            <el-form-item label="SSL配置">
              <el-radio-group v-model="sslConfig">
                <el-radio label="兼容旧浏览器(安全性降低)" value="old" />
                <el-radio label="兼容大部分浏览器(更安全)" value="partly" />
                <el-radio label="自定义" value="custom" />
              </el-radio-group>
            </el-form-item>
            <template v-if="sslConfig === 'custom'">
              <el-form-item label="ssl_protocols">
                <el-input
                  v-model="formData.https_listen.ssl_protocols"
                  style="width: 220px"
                />
              </el-form-item>
              <el-form-item label="ssl_ciphers">
                <el-input
                  v-model="formData.https_listen.ssl_ciphers"
                  style="width: 220px"
                />
              </el-form-item>
              <el-form-item label="ssl_prefer_server_ciphers">
                <el-input
                  v-model="formData.https_listen.ssl_prefer_server_ciphers"
                  style="width: 220px"
                />
              </el-form-item>
            </template>
          </template>
        </template>
        <Label value="源站设置" />
        <el-form-item label="源站列表">
          <div class="space-y-4 w-full">
            <el-button size="small" type="primary" @click="backendModal = true"
              >新增</el-button
            >
            <el-table border size="small" :data="backendList">
              <el-table-column prop="addr" label="源站" show-overflow-tooltip />
              <el-table-column
                prop="weight"
                label="权重"
                show-overflow-tooltip
              />
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
        <el-form-item label="负载方式">
          <el-select v-model="formData.balance_way" style="width: 220px">
            <el-option label="轮询" value="rr" />
            <el-option label="ip hash" value="ip_hash" />
          </el-select>
        </el-form-item>
        <el-form-item label="源站健康检查">
          <el-switch v-model="formData.health_check.enable" />
        </el-form-item>
        <template v-if="formData.health_check.enable">
          <el-form-item label="域名">
            <el-input
              v-model="formData.health_check.host"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="路径">
            <el-input
              v-model="formData.health_check.path"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="有效状态码">
            <el-input
              v-model="formData.health_check.status_code"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="检查间隔时间(秒)">
            <el-input
              v-model="formData.health_check.interval"
              style="width: 220px"
            />
          </el-form-item>
        </template>
        <Label value="回源设置" />
        <template v-if="!formData.backend_port_mapping">
          <el-form-item label="回源协议">
            <el-radio-group v-model="formData.backend_protocol">
              <el-radio label="HTTP" value="http" />
              <el-radio label="HTTPS" value="https" />
              <el-radio label="跟随协议" value="follow" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="['http', 'follow'].includes(formData.backend_protocol)"
            label="HTTP回源端口"
          >
            <el-input
              v-model="formData.backend_http_port"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item
            v-if="['https', 'follow'].includes(formData.backend_protocol)"
            label="HTTPS回源端口"
          >
            <el-input
              v-model="formData.backend_https_port"
              style="width: 220px"
            />
          </el-form-item>
        </template>
        <el-form-item label="跟随端口和协议">
          <el-switch v-model="formData.backend_port_mapping" />
        </el-form-item>
        <div class="flex gap-x-4">
          <el-form-item label="回源域名">
            <el-radio-group v-model="formData.backend_host">
              <el-radio label="访问域名" value="$host" />
              <el-radio label="访问域名:访问端口" value="$host:$server_port" />
              <el-radio label="自定义" value="" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="
              !['$host', '$host:$server_port'].includes(formData.backend_host)
            "
            label="域名"
          >
            <el-input v-model="formData.backend_host" style="width: 220px" />
          </el-form-item>
        </div>
        <el-form-item label="回源超时">
          <el-input v-model="formData.proxy_timeout" style="width: 220px" />
        </el-form-item>
      </template>
      <div v-if="currentTab === 'cache'" class="space-y-4">
        <el-button size="small" type="success" @click="cacheModal = true"
          >新增</el-button
        >
        <el-table size="small" border :data="cacheList">
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
              <el-button
                size="small"
                type="danger"
                @click="cacheList.splice($index, 1)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-if="currentTab === 'security'">
        <Label value="CC防护" />
        <div class="flex gap-x-4">
          <el-form-item label="默认防护">
            <el-radio-group v-model="formData.cc_default_rule">
              <el-radio value="10002" label="关闭" />
              <el-radio
                v-for="item of ccRuleList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
              <el-radio value="" label="自定义" />
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="
              !['10002', ...ccRuleList.map(i => i.value)].includes(
                formData.cc_default_rule
              )
            "
            label-width="0"
          >
            <el-select v-model="formData" style="width: 220px">
              <el-option
                v-for="item of ccCustomRuleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="flex gap-x-4">
          <el-form-item label="自动提升防护等级">
            <el-switch v-model="formData.cc_switch.enable" />
          </el-form-item>
          <template v-if="formData.cc_switch.enable">
            <span class="text-sm text-gray-400 leading-8"
              >当网站每秒请求数大于</span
            >
            <el-form-item label-width="0">
              <el-radio-group v-model="formData.cc_switch.switch">
                <el-radio label="20(小型网站)" value="20" />
                <el-radio label="50(中型网站)" value="50" />
                <el-radio label="200(大型网站)" value="200" />
                <el-radio label="自定义" value="" />
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="!['20', '50', '200'].includes(formData.cc_switch.switch)"
              label-width="0"
            >
              <el-input
                v-model="formData.cc_switch.switch"
                style="width: 220px"
              />
            </el-form-item>
            <span class="text-sm text-gray-400 leading-8"
              >时，防护等级提升到</span
            >
            <el-form-item label-width="0">
              <el-select v-model="formData.cc_switch.rule">
                <el-option-group label="系统内置规则">
                  <el-option
                    v-for="item of ccRuleList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-option-group>
                <el-option-group label="自定义规则">
                  <el-option
                    v-for="item of ccCustomRuleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
          </template>
        </div>
        <!--        <el-form-item label="自定义规则">-->
        <!--          <div class="space-y-4 w-full">-->
        <!--            <el-button-->
        <!--              size="small"-->
        <!--              type="primary"-->
        <!--              @click="customRuleModal = true"-->
        <!--              >新增</el-button-->
        <!--            >-->
        <!--            <el-table border size="small" :data="customRuleList" class="w-full">-->
        <!--              <el-table-column label="匹配" width="300" show-overflow-tooltip>-->
        <!--                <template #default="{ row }">-->
        <!--                  <div clas="space-y-2">-->
        <!--                    <div v-for="(item, key) in row.matcher" :key="key">-->
        <!--                      {{ `${key} ${item.operator} ${item.value}` }}-->
        <!--                    </div>-->
        <!--                  </div>-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <!--              <el-table-column label="执行过滤" show-overflow-tooltip>-->
        <!--                <template #default="{ row }">-->
        <!--                  {{ row.filter.type }}-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <!--              <el-table-column label="操作">-->
        <!--                <template #default="{ $index }">-->
        <!--                  <el-button-->
        <!--                    size="small"-->
        <!--                    type="danger"-->
        <!--                    @click="customRuleList.splice($index, 1)"-->
        <!--                  >-->
        <!--                    删除-->
        <!--                  </el-button>-->
        <!--                </template>-->
        <!--              </el-table-column>-->
        <!--            </el-table>-->
        <!--          </div>-->
        <!--        </el-form-item>-->
        <el-form-item label="搜索引擎爬虫">
          <el-radio-group v-model="formData.spider_allow">
            <el-radio label="不设置" value="" />
            <el-radio label="放行" value="allow" />
            <el-radio label="拦截" value="deny" />
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          选择放行后，百度、搜狗、神马、必应、谷歌、头条、360这些蜘蛛不受防CC规则影响。
        </el-form-item>
        <Label value="黑白名单" />
        <el-form-item label="黑名单IP">
          <el-input
            v-model="formData.black_ip"
            type="textarea"
            :rows="5"
            placeholder="一行一个，支持8/16/24子掩码"
          />
        </el-form-item>
        <el-form-item label="白名单IP">
          <el-input
            v-model="formData.white_ip"
            type="textarea"
            :rows="5"
            placeholder="一行一个，支持8/16/24子掩码"
          />
        </el-form-item>
        <Label value="屏蔽设置" />
        <el-form-item label="屏蔽透明代理">
          <el-switch v-model="formData.block_proxy" />
        </el-form-item>
        <Label value="区域屏蔽" />
        <el-form-item label="屏蔽设置">
          <el-radio-group v-model="formData.block_region">
            <el-radio
              v-for="item of regionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-radio-group>
        </el-form-item>
      </template>
      <template v-if="currentTab === 'control'">
        <Label value="ACL规则" />
        <el-form-item label="ACL规则">
          <el-select v-model="formData.acl" style="width: 220px">
            <el-option
              v-for="item of aclList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <Label value="防盗链" />
        <el-form-item label="开启">
          <el-switch v-model="formData.hotlink.enable" />
        </el-form-item>
        <template v-if="formData.hotlink.enable">
          <el-form-item label="防盗链范围">
            <el-radio-group v-model="formData.hotlink.scope_type">
              <el-radio label="整站" value="all" />
              <el-radio label="后缀" value="suffix" />
              <el-radio label="目录" value="dir" />
              <el-radio label="全路径" value="full_path" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.hotlink.scope_type !== 'all'">
            <el-input
              v-model="formData.hotlink.scope_content"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="允许空来源">
            <el-radio-group v-model="formData.hotlink.allow_empty">
              <el-radio label="允许" :value="true" />
              <el-radio label="不允许" :value="false" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="允许的域名">
            <el-input
              v-model="formData.hotlink.domain"
              placeholder="请输入当前网站域名之外的域名 多个域名空格分割"
              style="width: 220px"
            />
          </el-form-item>
        </template>
        <Label value="跨域访问" />
        <el-form-item label="开启">
          <el-switch v-model="formData.cors.enable" />
        </el-form-item>
        <template v-if="formData.cors.enable">
          <el-form-item label="allow_origin">
            <el-input
              v-model="formData.cors.allow_origin"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="allow_methods">
            <el-input
              v-model="formData.cors.allow_methods"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="allow_headers">
            <el-input
              v-model="formData.cors.allow_headers"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="expose_headers">
            <el-input
              v-model="formData.cors.expose_headers"
              style="width: 220px"
            />
          </el-form-item>
          <el-form-item label="allow_credentials">
            <el-switch v-model="formData.cors.allow_credentials" />
          </el-form-item>
          <el-form-item label="max_age">
            <el-input v-model="formData.cors.max_age" style="width: 220px" />
          </el-form-item>
        </template>
      </template>
      <template v-if="currentTab === 'advance'">
        <Label value="压缩设置" />
        <el-form-item label="Gzip压缩">
          <el-switch v-model="formData.gzip_enable" />
        </el-form-item>
        <Label value="websocket设置" />
        <el-form-item label="websocket">
          <el-switch v-model="formData.websocket_enable" />
        </el-form-item>
        <Label value="搜索引擎回源设置" />
        <div class="flex gap-x-4">
          <el-form-item label="搜索引擎回源">
            <el-switch v-model="formData.spider_to_sip" />
          </el-form-item>
          <template v-if="formData.spider_to_sip">
            <el-input v-model="formData.spider_to_sip" style="width: 220px" />
            <span class="leading-8 text-sm text-gray-400"
              >谨慎使用，有泄露IP的风险</span
            >
          </template>
        </div>
        <Label value="源站请求头" />
        <el-button size="small" type="success" @click="reqHeaderModal = true"
          >新增</el-button
        >
        <el-table size="small" border :data="reqHeaderList">
          <el-table-column label="请求头" prop="name" show-overflow-tooltip />
          <el-table-column label="值" prop="value" show-overflow-tooltip />
          <el-table-column width="100" fixed="right" label="操作">
            <template #default="{ $index }">
              <el-button
                size="small"
                type="danger"
                @click="resHeaderList.splice($index, 1)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Label value="CDN响应头" />
        <el-button size="small" type="success" @click="resHeaderModal = true"
          >新增</el-button
        >
        <el-table size="small" border :data="resHeaderList">
          <el-table-column label="名称" prop="name" show-overflow-tooltip />
          <el-table-column label="值" prop="value" show-overflow-tooltip />
          <el-table-column width="100" fixed="right" label="操作">
            <template #default="{ $index }">
              <el-button
                size="small"
                type="danger"
                @click="resHeaderList.splice($index, 1)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Label value="URL转向" />
        <el-button size="small" type="success" @click="urlRedirectModal = true"
          >新增</el-button
        >
        <el-table size="small" border :data="urlRedirectList">
          <el-table-column label="域名端口" prop="host" show-overflow-tooltip />
          <el-table-column label="匹配" prop="match" show-overflow-tooltip />
          <el-table-column label="转向" prop="redirect" show-overflow-tooltip />
          <el-table-column label="响应码" prop="code" show-overflow-tooltip />
          <el-table-column width="100" fixed="right" label="操作">
            <template #default="{ $index }">
              <el-button
                size="small"
                type="danger"
                @click="urlRedirectList.splice($index, 1)"
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <Label value="其他设置" />
        <el-form-item label="/.well-known/acme-challenge/请求回源">
          <el-switch v-model="formData.acme_proxy_to_orgin" />
        </el-form-item>
        <el-form-item
          label="数据实时返回（节点收到源数据时，立即返回给客户端）"
        >
          <el-switch v-model="formData.recv_real_time" />
        </el-form-item>
        <el-form-item
          label="数据实时发送（节点收到客户端数据时，立即发送给源）"
        >
          <el-switch v-model="formData.send_real_time" />
        </el-form-item>
      </template>
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
    <el-dialog v-model="cacheModal" title="添加缓存">
      <el-form :model="cacheFormData" label-width="100" label-position="left">
        <el-form-item label="类型">
          <el-select v-model="cacheFormData.type" style="width: 220px">
            <el-option label="后缀名" value="suffix" />
            <el-option label="目录" value="dir" />
            <el-option label="全路径" value="full_path" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="cacheFormData.content"
            placeholder="多个用|分割"
            style="width: 220px"
          />
        </el-form-item>
        <div class="flex gap-x-4">
          <el-form-item label="有效期">
            <el-input v-model="cacheFormData.expire" style="width: 220px" />
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
            @click="
              () => {
                cacheRuleList.push(cacheRuleForm);
                cacheRuleForm = {};
              }
            "
            >添加</el-button
          >
        </div>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              cacheList.push({
                ...cacheFormData,
                no_cache: cacheRuleList
              });
              cacheFormData = {
                ignore_arg: false,
                range: false
              };
              cacheRuleList = [];
              cacheModal = false;
            }
          "
          >保存</el-button
        >
      </template>
    </el-dialog>
    <el-dialog v-model="urlRedirectModal" title="添加URL转向">
      <el-form :model="urlRedirectForm" label-width="200" label-position="left">
        <el-form-item label="域名:端口">
          <el-input v-model="urlRedirectForm.host" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="User-Agent">
          <el-input v-model="urlRedirectForm.user_agent" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="Referer">
          <el-input v-model="urlRedirectForm.referer" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="国家代码">
          <el-input
            v-model="urlRedirectForm.country_code"
            style="width: 220px"
          />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="Accept-Language">
          <el-input
            v-model="urlRedirectForm.accept_language"
            style="width: 220px"
          />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="urlRedirectForm.province" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="urlRedirectForm.city" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="运营商">
          <el-input v-model="urlRedirectForm.isp" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="AS号码">
          <el-input v-model="urlRedirectForm.asnumber" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持正则表达式</span
          >
        </el-form-item>
        <el-form-item label="匹配URI">
          <el-input v-model="urlRedirectForm.match" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >支持用小括号捕获</span
          >
        </el-form-item>
        <el-form-item label="重写到">
          <el-input v-model="urlRedirectForm.redirect" style="width: 220px" />
          <span class="text-sm text-gray-400 leading-8 ml-4"
            >用$1引用捕获内容</span
          >
        </el-form-item>
        <el-form-item label="响应码">
          <el-select v-model="urlRedirectForm.code" style="width: 220px">
            <el-option label="301" value="301" />
            <el-option label="302" value="302" />
            <el-option label="307" value="307" />
            <el-option label="内部" value="internal" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              urlRedirectList.push(urlRedirectForm);
              urlRedirectModal = false;
            }
          "
          >保存</el-button
        >
      </template>
    </el-dialog>
    <el-dialog v-model="resHeaderModal" title="添加CDN响应头">
      <el-form :model="resHeaderForm" label-width="100" label-position="left">
        <el-form-item label="响应头">
          <el-input v-model="resHeaderForm.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="resHeaderForm.value" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              resHeaderList.push(resHeaderForm);
              resHeaderForm = {};
              resHeaderModal = false;
            }
          "
          >保存</el-button
        >
      </template>
    </el-dialog>
    <el-dialog v-model="reqHeaderModal" title="添加源站请求头">
      <el-form :model="reqHeaderForm" label-width="100" label-position="left">
        <el-form-item label="请求头">
          <el-input v-model="reqHeaderForm.name" style="width: 220px" />
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="reqHeaderForm.value" style="width: 220px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button
          type="primary"
          @click="
            () => {
              reqHeaderList.push(reqHeaderForm);
              reqHeaderForm = {};
              reqHeaderModal = false;
            }
          "
          >保存</el-button
        >
      </template>
    </el-dialog>
    <!--    <el-dialog v-model="customRuleModal" title="添加自定义规则">-->
    <!--      <el-form label-width="100" :model="customRuleForm">-->
    <!--        <el-form-item label="匹配条件">-->
    <!--          <div class="flex gap-2 flex-wrap">-->
    <!--            <el-tag-->
    <!--              v-for="(item, key) in customRuleForm.matcher"-->
    <!--              :key="key"-->
    <!--              closable-->
    <!--              type="primary"-->
    <!--              @close="delete customRuleForm.matcher[key]"-->
    <!--            >-->
    <!--              {{ `${key} ${item.operator} ${item.value.replace(/\n/g, " ")}` }}-->
    <!--            </el-tag>-->
    <!--          </div>-->
    <!--        </el-form-item>-->
    <!--        <div class="flex gap-x-4">-->
    <!--          <el-select-->
    <!--            v-model="customMatchRuleForm.name"-->
    <!--            placeholder="请选择匹配项"-->
    <!--            style="width: 220px"-->
    <!--          >-->
    <!--            <el-option-->
    <!--              v-for="item of aclMatchList"-->
    <!--              :key="item.value"-->
    <!--              :label="item.label"-->
    <!--              :value="item.value"-->
    <!--            />-->
    <!--          </el-select>-->
    <!--          <el-select-->
    <!--            v-model="customMatchRuleForm.operator"-->
    <!--            placeholder="操作符"-->
    <!--            style="width: 220px"-->
    <!--          >-->
    <!--            <el-option-->
    <!--              v-for="item of aclMatchOperatorList"-->
    <!--              :key="item.value"-->
    <!--              :label="item.label"-->
    <!--              :value="item.value"-->
    <!--            />-->
    <!--          </el-select>-->
    <!--          <el-input-->
    <!--            v-model="customMatchRuleForm.value"-->
    <!--            type="textarea"-->
    <!--            placeholder="一行一个匹配值，可为空"-->
    <!--            :rows="3"-->
    <!--            style="width: 220px"-->
    <!--          />-->
    <!--          <el-button-->
    <!--            type="primary"-->
    <!--            @click="-->
    <!--              () => {-->
    <!--                customRuleForm.matcher[customMatchRuleForm.name] = {-->
    <!--                  operator: customMatchRuleForm.operator,-->
    <!--                  value: customMatchRuleForm.value-->
    <!--                };-->
    <!--                customMatchRuleForm = {-->
    <!--                  name: '',-->
    <!--                  operator: '',-->
    <!--                  value: ''-->
    <!--                };-->
    <!--              }-->
    <!--            "-->
    <!--          >-->
    <!--            添加-->
    <!--          </el-button>-->
    <!--        </div>-->
    <!--        <el-form-item label="执行过滤">-->
    <!--          <el-radio-group>-->
    <!--            <el-radio label="允许" value="allow" />-->
    <!--            <el-radio label="拒绝" value="deny" />-->
    <!--          </el-radio-group>-->
    <!--        </el-form-item>-->
    <!--      </el-form>-->
    <!--      <template #footer>-->
    <!--        <el-button type="primary" @click="() => {}"> 提交 </el-button>-->
    <!--      </template>-->
    <!--    </el-dialog>-->
  </div>
</template>
<style scoped>
:deep(.el-input),
:deep(.el-select) {
  width: 220px;
}
</style>
