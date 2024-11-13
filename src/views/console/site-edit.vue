<script setup>
import Label from "@/components/Label/index.vue";
import { onMounted, ref, reactive, watch } from "vue";
import {
  getSiteDetail,
  editSite,
  getSiteGroupList,
  getCertList
} from "@/api/console";
import { getMyPackageList } from "@/api/package";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";
import { httpsSSLConfig } from "./model.js";

const route = useRoute();
const currentTab = ref("basic");
const tabs = [
  { label: "基本配置", value: "basic" },
  { label: "缓存配置", value: "cache" },
  { label: "安全配置", value: "security" }
  // { label: "访问控制", value: "control" },
  // { label: "高级配置", value: "advance" }
];
const siteInfo = ref(null);
const packageList = ref([]);
const groupList = ref([]);
const certList = ref([]);
const formData = reactive({
  user_package: "",
  domain: "",
  groups: "",
  http_listen_enable: false,
  http_listen: {},
  https_listen_enable: false,
  https_listen: {},
  https_ssl_config_radio: "old",
  backend: [],
  balance_way: "",
  health_check_enable: false,
  health_check: {},
  backend_protocol: "",
  backend_http_port: "",
  backend_port_mapping: false,
  backend_host: "",
  backend_host_radio: "",
  proxy_timeout: "",
  proxy_cache: [],
  cc_default_rule: "",
  cc_switch_enable: false,
  cc_switch: {},
  spider_allow: "",
  black_ip: "",
  white_ip: "",
  block_proxy: false,
  block_region: ""
});
const backendModal = ref(false);
const backendFormData = reactive({
  addr: "",
  weight: 1,
  state: "up"
});

const addBackend = async () => {
  formData.backend.push({ ...backendFormData });
  await handleChange("backend", formData.backend);
  backendFormData.addr = "";
  backendFormData.weight = 1;
  backendFormData.state = "up";
  backendModal.value = false;
};

const cacheModal = ref(false);
const cacheFormData = reactive({});
const cacheRuleList = ref([]);
const cacheRuleForm = reactive({
  variable: "",
  string: ""
});

const addCache = async () => {
  formData.proxy_cache.push({ ...cacheFormData });
  await handleChange("proxy_cache", formData.proxy_cache);
  Object.keys(cacheFormData).forEach(key => {
    cacheFormData[key] = "";
  });
  cacheModal.value = false;
};

const handleChange = async (key, val) => {
  if (key === "groups") {
    val = val.toString();
  }

  await editSite(route.query.id, { [key]: val });
  ElMessage.success("修改成功");
};

onMounted(async () => {
  const result = await getSiteDetail(route.query.id);
  siteInfo.value = result.data;
  Object.keys(formData).forEach(key => {
    let value = siteInfo.value[key];
    if (key === "groups") {
      value = value?.split() || [];
    }
    if (key === "http_listen_enable") {
      value = siteInfo.value.http_listen !== "{}";
    }
    if (
      [
        "http_listen",
        "https_listen",
        "backend",
        "health_check",
        "proxy_cache",
        "cc_switch"
      ].includes(key)
    ) {
      value = JSON.parse(value);
    }
    if (key === "https_listen_enable") {
      value = siteInfo.value.https_listen !== "{}";
    }
    if (key === "https_ssl_config_radio") {
      const httpsData = JSON.parse(siteInfo.value.https_listen);
      if (
        httpsData.ssl_ciphers === httpsSSLConfig.old.ssl_ciphers &&
        httpsData.ssl_prefer_server_ciphers ===
          httpsSSLConfig.old.ssl_prefer_server_ciphers &&
        httpsData.ssl_protocols === httpsSSLConfig.old.ssl_protocols
      ) {
        value = "old";
      } else if (
        httpsData.ssl_ciphers === httpsSSLConfig.partly.ssl_ciphers &&
        httpsData.ssl_prefer_server_ciphers ===
          httpsSSLConfig.partly.ssl_prefer_server_ciphers &&
        httpsData.ssl_protocols === httpsSSLConfig.partly.ssl_protocols
      ) {
        value = "partly";
      } else {
        value = "custom";
      }
    }
    if (key === "health_check_enable") {
      value = siteInfo.value.health_check !== "{}";
    }
    if (key === "backend_host_radio") {
      value = ["$host", "$host:$server_port"].includes(
        siteInfo.value.backend_host
      )
        ? siteInfo.value.backend_host
        : "custom";
    }
    if (key === "cc_switch") {
      value = siteInfo.value.cc_switch !== "{}";
    }
    formData[key] = value;
  });
  ({ data: packageList.value } = await getMyPackageList({ limit: 0 }));
  ({ data: groupList.value } = await getSiteGroupList({ limit: 0 }));
  ({ data: certList.value } = await getCertList({ limit: 0, valid: 1 }));
});
</script>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl p-4">
      <div
        class="flex bg-slate-100 rounded-xl text-sm font-bold text-slate-500"
      >
        <div
          v-for="(item, index) of tabs"
          :key="item.value"
          :class="[
            'flex-1 py-4 text-center hover:text-white hover:bg-[#5570E2] transition-all cursor-pointer',
            { 'rounded-l-xl': index === 0 },
            { 'rounded-r-xl': index === tabs.length - 1 },
            { 'text-white bg-[#5570E2]': currentTab === item.value }
          ]"
          @click="currentTab = item.value"
        >
          {{ item.label }}
        </div>
      </div>
    </div>
    <div class="rounded-xl bg-white p-4 space-y-4">
      <template v-if="currentTab === 'basic'">
        <Label value="基本信息" />
        <div class="grid grid-cols-2 gap-4 text-sm w-[300px]">
          <div class="text-slate-500">启用：</div>
          <div>{{ siteInfo?.enable === 1 ? "已开启" : "未开启" }}</div>
          <div class="text-slate-500">配置同步：</div>
          <div>{{ siteInfo?.sync_state === "done" ? "已完成" : "未完成" }}</div>
          <div class="text-slate-500">CNAME：</div>
          <div>
            {{ `${siteInfo?.cname_hostname}${siteInfo?.cname_domain}` }}
          </div>
          <div class="text-slate-500">套餐到期：</div>
          <div>{{ siteInfo?.end_at }}</div>
          <div class="text-slate-500">创建时间：</div>
          <div>{{ siteInfo?.create_at2 }}</div>
          <div class="text-slate-500">更新时间：</div>
          <div>{{ siteInfo?.update_at2 }}</div>
        </div>
        <Label value="基本设置" />
        <el-form :model="formData" class="w-[300px]">
          <el-form-item label="套餐">
            <el-select
              v-model="formData.user_package"
              @change="handleChange('user_package', $event)"
            >
              <el-option
                v-for="item of packageList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="域名">
            <el-input
              v-model="formData.domain"
              @blur="handleChange('domain', $event.target.value)"
            />
          </el-form-item>
          <el-form-item label="所属分组">
            <el-select
              v-model="formData.groups"
              multiple
              @change="handleChange('groups', $event)"
            >
              <el-option
                v-for="item of groupList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <Label value="HTTP设置" />
        <el-form :model="formData" class="w-[300px]">
          <el-form-item>
            <el-switch
              v-model="formData.http_listen_enable"
              @change="
                handleChange('http_listen', $event ? formData.http_listen : {})
              "
            />
          </el-form-item>
          <el-form-item v-if="formData.http_listen_enable" label="监听端口">
            <el-input
              v-model="formData.http_listen.port"
              @blur="handleChange('http_listen', { port: $event.target.value })"
            />
          </el-form-item>
        </el-form>
        <Label value="HTTPS设置" />
        <el-form :model="formData" class="w-[600px]">
          <el-switch
            v-model="formData.https_listen_enable"
            @change="
              handleChange(
                'https_listen_enable',
                $event ? formData.https_listen : {}
              )
            "
          />
          <template v-if="formData.https_listen_enable">
            <el-form-item label="证书">
              <el-select
                v-model="formData.https_listen.cert"
                @change="handleChange('https_listen', { cert: $event })"
              >
                <el-option
                  v-for="item of certList"
                  :key="item.id"
                  :value="String(item.id)"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="监听端口">
              <el-input
                v-model="formData.https_listen.port"
                @blur="
                  handleChange('https_listen', {
                    port: $event.target.value
                  })
                "
              />
            </el-form-item>
            <el-form-item label="HSTS">
              <el-switch
                v-model="formData.https_listen.hsts"
                @change="handleChange('https_listen', { hsts: $event })"
              />
            </el-form-item>
            <el-form-item label="HTTP2">
              <el-switch
                v-model="formData.https_listen.http2"
                @change="handleChange('https_listen', { http2: $event })"
              />
            </el-form-item>
            <el-form-item label="HTTP3">
              <el-switch
                v-model="formData.https_listen.http3"
                @change="handleChange('https_listen', { http3: $event })"
              />
            </el-form-item>
            <div class="flex items-center gap-x-4">
              <el-form-item label="强制HTTPS">
                <el-switch
                  v-model="formData.https_listen.force_ssl_enable"
                  @change="
                    handleChange('https_listen', { force_ssl_enable: $event })
                  "
                />
              </el-form-item>
              <el-form-item label="跳转端口">
                <el-input
                  v-model="formData.https_listen.force_ssl_port"
                  @blur="
                    handleChange('https_listen', {
                      force_ssl_port: $event.target.value
                    })
                  "
                />
              </el-form-item>
            </div>
            <el-form-item label="OCSP Stapling">
              <el-switch
                v-model="formData.https_listen.ocsp_stapling"
                @change="
                  handleChange('https_listen', { ocsp_stapling: $event })
                "
              />
            </el-form-item>
            <el-form-item label="SSL配置">
              <el-radio-group
                v-model="formData.https_ssl_config_radio"
                @change="
                  value => {
                    if (value !== 'custom') {
                      formData.https_listen = {
                        ...formData.https_listen,
                        ...httpsSSLConfig[value]
                      };
                      handleChange('https_listen', httpsSSLConfig[value]);
                    }
                  }
                "
              >
                <el-radio value="old">兼容旧浏览器</el-radio>
                <el-radio value="partly">兼容大部分浏览器(更安全)</el-radio>
                <el-radio value="custom">自定义</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="formData.https_ssl_config_radio === 'custom'">
              <el-form-item label="ssl_protocols">
                <el-input
                  v-model="formData.https_listen.ssl_protocols"
                  @blur="
                    handleChange('https_listen', {
                      ssl_protocols: $event.target.value,
                      ssl_ciphers: formData.https_listen.ssl_ciphers,
                      ssl_prefer_server_ciphers:
                        formData.https_listen.ssl_prefer_server_ciphers
                    })
                  "
                />
              </el-form-item>
              <el-form-item label="ssl_ciphers">
                <el-input
                  v-model="formData.https_listen.ssl_ciphers"
                  @blur="
                    handleChange('https_listen', {
                      ssl_protocols: formData.https_listen.ssl_protocols,
                      ssl_ciphers: $event.target.value,
                      ssl_prefer_server_ciphers:
                        formData.https_listen.ssl_prefer_server_ciphers
                    })
                  "
                />
              </el-form-item>
              <el-form-item label="ssl_prefer_server_ciphers">
                <el-input
                  v-model="formData.https_listen.ssl_prefer_server_ciphers"
                  @blur="
                    handleChange('https_listen', {
                      ssl_protocols: formData.https_listen.ssl_protocols,
                      ssl_ciphers: formData.https_listen.ssl_ciphers,
                      ssl_prefer_server_ciphers: $event.target.value
                    })
                  "
                />
              </el-form-item>
            </template>
          </template>
        </el-form>
        <Label value="源站设置" />
        <el-form :model="formData" class="w-[600px]">
          <el-form-item label="源站列表">
            <div class="space-y-4">
              <el-button
                size="small"
                type="success"
                @click="backendModal = true"
                >新增</el-button
              >
              <el-table size="small" border :data="formData.backend">
                <el-table-column label="源地址" prop="addr" />
                <el-table-column label="权重" prop="weight" />
                <el-table-column label="状态">
                  <template #default="{ row }">
                    <div>
                      {{
                        row.state === "up"
                          ? "线上"
                          : row.state === "down"
                            ? "线下"
                            : "备用"
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template #default="{ row }">
                    <el-button
                      type="danger"
                      size="small"
                      @click="
                        () => {
                          const data = formData.backend.filter(
                            i => i.addr !== row.addr
                          );
                          formData.backend = data.slice();
                          handleChange('backend', data);
                        }
                      "
                      >删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="负载方式">
            <el-select
              v-model="formData.balance_way"
              @change="handleChange('balance_way', $event)"
            >
              <el-option label="轮询" value="rr" />
              <el-option label="ip_hash" value="ip_hash" />
            </el-select>
          </el-form-item>
          <el-form-item label="源站健康检查">
            <el-switch
              v-model="formData.health_check_enable"
              @change="handleChange('health_check', { enable: $event })"
            />
          </el-form-item>
          <template v-if="formData.health_check_enable">
            <el-form-item label="域名">
              <el-input
                v-model="formData.health_check.host"
                @blur="
                  handleChange('health_check', {
                    host: $event.target.value
                  })
                "
              />
            </el-form-item>
            <el-form-item label="路径">
              <el-input
                v-model="formData.health_check.path"
                @blur="
                  handleChange('health_check', {
                    path: $event.target.value
                  })
                "
              />
            </el-form-item>
            <el-form-item label="有效状态码">
              <el-input
                v-model="formData.health_check.status_code"
                @blur="
                  handleChange('health_check', {
                    status_code: $event.target.value
                  })
                "
              />
            </el-form-item>
            <el-form-item label="检查间隔时间(秒)">
              <el-input
                v-model="formData.health_check.interval"
                @blur="
                  handleChange('health_check', {
                    enable: $event.target.value
                  })
                "
              />
            </el-form-item>
          </template>
        </el-form>
        <Label value="回源设置" />
        <el-form :model="formData" class="w-[600px]">
          <template v-if="!formData.backend_port_mapping">
            <el-form-item label="回源协议">
              <el-radio-group
                v-model="formData.backend_protocol"
                @change="handleChange('backend_protocol', $event)"
              >
                <el-radio value="http">HTTP</el-radio>
                <el-radio value="https">HTTPS</el-radio>
                <el-radio value="follow">跟随协议</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="HTTP回源端口">
              <el-input
                v-model="formData.backend_http_port"
                @blur="handleChange('backend_http_port', $event.target.value)"
              />
            </el-form-item>
          </template>
          <el-form-item label="跟随端口和协议">
            <el-switch
              v-model="formData.backend_port_mapping"
              @change="handleChange('backend_port_mapping', $event)"
            />
          </el-form-item>
          <el-form-item label="回源域名">
            <el-radio-group
              v-model="formData.backend_host"
              @change="
                val => {
                  if (val !== 'custom') {
                    handleChange('backend_host', val);
                  }
                }
              "
            >
              <el-radio value="$host">访问域名</el-radio>
              <el-radio value="$host:$server_port">访问域名:访问端口</el-radio>
              <el-radio value="custom">访问域名</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="
              !['$host', '$host:$server_port'].includes(formData.backend_host)
            "
          >
            <el-input
              v-model="formData.backend_host"
              @blur="handleChange('backend_host', $event.target.value)"
            />
          </el-form-item>
          <el-form-item label="回源超时(秒)">
            <el-input
              v-model="formData.proxy_timeout"
              @blur="handleChange('proxy_timeout', $event.target.value)"
            />
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="currentTab === 'cache'">
        <el-button size="small" type="success" @click="cacheModal = true"
          >新增</el-button
        >
        <el-table size="small" border :data="formData.proxy_cache">
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
            <template #default="{ row }">
              <el-button
                size="small"
                type="danger"
                @click="
                  () => {
                    const data = formData.proxy_cache.filter(
                      i => i.content !== row.content
                    );
                    formData.proxy_cache = data.slice();
                    handleChange('proxy_cache', data);
                  }
                "
                >删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-else-if="currentTab === 'security'">
        <Label value="CC防护" />
        <el-form :model="formData">
          <el-form-item label="默认防护">
            <el-radio-group
              v-model="formData.cc_default_rule"
              @change="handleChange('cc_default_rule', $event)"
            >
              <el-radio :value="10002" label="关闭" />
              <el-radio :value="6" label="宽松" />
              <el-radio :value="1" label="JS验证" />
              <el-radio :value="10001" label="5秒盾" />
              <el-radio :value="10000" label="点击验证" />
              <el-radio :value="2" label="滑块验证" />
              <el-radio :value="4" label="验证码" />
              <el-radio :value="10003" label="旋转图片" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="自动提升防护等级">
            <el-switch
              v-model="formData.cc_switch_enable"
              @change="
                () => {
                  formData.cc_switch = { enable: 1, switch: 20, rule: '1' };
                  handleChange('cc_switch', $event ? formData.cc_switch : {});
                }
              "
            />
          </el-form-item>
          <div
            v-if="formData.cc_switch_enable"
            class="flex items-center gap-x-4 text-sm"
          >
            <div>当网站每秒请求数大于</div>
            <el-select
              v-model="formData.cc_switch.switch"
              style="width: 200px"
              @change="
                handleChange('cc_switch', {
                  enable: 1,
                  switch: $event,
                  rule: formData.cc_switch.rule
                })
              "
            >
              <el-option value="20" label="20(小型网站)" />
              <el-option value="50" label="50(中型网站)" />
              <el-option value="200" label="200(大型网站)" />
            </el-select>
            <div>时，防护等级提升到</div>
            <el-select
              v-model="formData.cc_switch.rule"
              style="width: 200px"
              @change="
                handleChange('cc_switch', {
                  enable: 1,
                  switch: formData.cc_switch.switch,
                  rule: $event
                })
              "
            >
              <el-option value="6" label="宽松" />
              <el-option value="1" label="JS验证" />
              <el-option value="10001" label="5秒盾" />
              <el-option value="10000" label="点击验证" />
              <el-option value="2" label="滑块验证" />
              <el-option value="4" label="验证码" />
              <el-option value="10003" label="旋转图片" />
            </el-select>
          </div>
          <el-form-item label="搜索引擎爬虫">
            <el-radio-group
              v-model="formData.spider_allow"
              @change="handleChange('spider_allow', $event)"
            >
              <el-radio value="" label="不设置" />
              <el-radio value="allow" label="放行" />
              <el-radio value="deny" label="拦截" />
            </el-radio-group>
          </el-form-item>
          <div class="text-sm">
            选择放行后，百度、搜狗、神马、必应、谷歌、头条、360这些蜘蛛不受防CC规则影响。
          </div>
        </el-form>
        <Label value="黑白名单" />
        <el-form :model="formData">
          <el-form-item label="黑名单IP">
            <el-input
              v-model="formData.black_ip"
              type="textarea"
              :rows="4"
              @blur="handleChange('black_ip', $event.target.value)"
            />
          </el-form-item>
          <el-form-item label="白名单IP">
            <el-input
              v-model="formData.white_ip"
              type="textarea"
              :rows="4"
              @blur="handleChange('white_ip', $event.target.value)"
            />
          </el-form-item>
        </el-form>
        <Label value="屏蔽设置" />
        <el-form :model="formData">
          <el-form-item label="屏蔽透明代理">
            <el-switch
              v-model="formData.block_proxy"
              @change="handleChange('block_proxy, $event')"
            />
          </el-form-item>
        </el-form>
        <Label value="区域屏蔽" />
        <el-form :model="formData">
          <el-form-item label="屏蔽透明代理">
            <el-radio-group
              v-model="formData.block_region"
              @change="handleChange('block_region, $event')"
            >
              <el-radio value="" label="不设置" />
              <el-radio
                value="mn,kp,kr,jp,vn,la,kh,th,mm,my,sg,id,bn,ph,tl,in,bd,bt,np,pk,lk,mv,sa,qa,bh,kw,ae,om,ye,ge,lb,sy,il,ps,jo,iq,ir,af,cy,az,tm,tj,kg,uz,kz,dz,ao,bj,bw,bf,bi,cm,cv,cf,td,km,ci,cd,dj,eg,gq,er,et,ga,gm,gh,gn,gw,ke,ls,lr,ly,mg,mw,ml,mr,mu,ma,mz,na,ne,ng,cg,rw,st,sn,sc,sl,so,za,sd,ss,tz,tg,tn,ug,zm,zw,ag,bs,bb,bz,ca,cr,cu,dm,do,sv,ai,bm,gl,gd,gp,gt,ht,hn,jm,mq,mx,ms,aw,cw,ni,pa,kn,lc,vc,tt,tc,us,mf,pr,bl,sx,ar,bo,br,cl,co,ec,gy,py,pe,sr,uy,ve,al,ad,am,at,by,be,ba,bg,hr,cz,dk,ee,fi,fr,de,gr,hu,is,ie,it,lv,li,lt,lu,mk,mt,md,mc,me,nl,no,pl,pt,ro,ru,sm,rs,sk,si,es,se,ch,tr,ua,uk,va,au,pg,nz,fj,sb,pf,nc,vu,ws,gu,fm,to,ki,as,pw,wf,nr,tv,nu,tk"
                label="国外(不包括港澳台)"
              />
              <el-radio
                value="hk,mo,tw,mn,kp,kr,jp,vn,la,kh,th,mm,my,sg,id,bn,ph,tl,in,bd,bt,np,pk,lk,mv,sa,qa,bh,kw,ae,om,ye,ge,lb,sy,il,ps,jo,iq,ir,af,cy,az,tm,tj,kg,uz,kz,dz,ao,bj,bw,bf,bi,cm,cv,cf,td,km,ci,cd,dj,eg,gq,er,et,ga,gm,gh,gn,gw,ke,ls,lr,ly,mg,mw,ml,mr,mu,ma,mz,na,ne,ng,cg,rw,st,sn,sc,sl,so,za,sd,ss,tz,tg,tn,ug,zm,zw,ag,bs,bb,bz,ca,cr,cu,dm,do,sv,ai,bm,gl,gd,gp,gt,ht,hn,jm,mq,mx,ms,aw,cw,ni,pa,kn,lc,vc,tt,tc,us,mf,pr,bl,sx,ar,bo,br,cl,co,ec,gy,py,pe,sr,uy,ve,al,ad,am,at,by,be,ba,bg,hr,cz,dk,ee,fi,fr,de,gr,hu,is,ie,it,lv,li,lt,lu,mk,mt,md,mc,me,nl,no,pl,pt,ro,ru,sm,rs,sk,si,es,se,ch,tr,ua,uk,va,au,pg,nz,fj,sb,pf,nc,vu,ws,gu,fm,to,ki,as,pw,wf,nr,tv,nu,tk"
                label="国外(包括港澳台)"
              />
              <el-radio value="cn,hk,mo,tw" label="中国(包括港澳台)" />
              <el-radio value="cn" label="中国(不包括港澳台)" />
            </el-radio-group>
          </el-form-item>
        </el-form>
      </template>
    </div>

    <el-dialog v-model="backendModal" title="添加源站">
      <el-form :model="backendFormData">
        <el-form-item label="源地址">
          <el-input v-model="backendFormData.addr" placeholder="1.2.3.4" />
        </el-form-item>
        <el-form-item label="权重">
          <el-input v-model="backendFormData.weight" />
        </el-form-item>
        <el-form-item label="源地址">
          <el-select v-model="backendFormData.state">
            <el-option label="线上" value="up" />
            <el-option label="线下" value="down" />
            <el-option label="备用" value="backup" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="addBackend">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog v-model="cacheModal" title="添加缓存">
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
            v-model="cacheFormData.variable"
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
            v-model="cacheFormData.string"
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
        <el-button type="primary" @click="addCache">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>
