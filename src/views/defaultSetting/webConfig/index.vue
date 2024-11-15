<script setup>
import { ElMessage } from "element-plus";
import { onMounted, reactive, ref, watch } from "vue";
import { getSiteGroupList, getDNSAPIList } from "@/api/console";
import {
  getDefaultSiteList,
  creteDefaultSite,
  editDefaultSite,
  optionDefaultSite,
  deleteDefaultSite
} from "@/api/defaultSetting";
import { configList } from "./model";
import CacheSetting from "@/components/CacheSetting/index.vue";
import reqHeaderSetting from "@/components/RequestHeaderSetting/index.vue";

const isLoading = ref(false);
const siteGroupList = ref([]);
const dnsApiList = ref([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  count: 0
});
const tableData = ref([]);

const getList = async () => {
  const { count, data } = await getDefaultSiteList({
    ...pagination,
    type: "site"
  });
  tableData.value = data;
  pagination.count = count;
};

const modal = ref(false);
const formData = ref({});
watch(
  () => formData.value.name,
  val => {
    if (formData.value.id) {
      return;
    }
    switch (val) {
      case "http_listen-port":
      case "backend_http_port":
        formData.value.value = 80;
        break;
      case "https_listen-port":
      case "backend_https_port":
        formData.value.value = 443;
        break;
      case "block_region":
        formData.value.value =
          "mn,kp,kr,jp,vn,la,kh,th,mm,my,sg,id,bn,ph,tl,in,bd,bt,np,pk,lk,mv,sa,qa,bh,kw,ae,om,ye,ge,lb,sy,il,ps,jo,iq,ir,af,cy,az,tm,tj,kg,uz,kz,dz,ao,bj,bw,bf,bi,cm,cv,cf,td,km,ci,cd,dj,eg,gq,er,et,ga,gm,gh,gn,gw,ke,ls,lr,ly,mg,mw,ml,mr,mu,ma,mz,na,ne,ng,cg,rw,st,sn,sc,sl,so,za,sd,ss,tz,tg,tn,ug,zm,zw,ag,bs,bb,bz,ca,cr,cu,dm,do,sv,ai,bm,gl,gd,gp,gt,ht,hn,jm,mq,mx,ms,aw,cw,ni,pa,kn,lc,vc,tt,tc,us,mf,pr,bl,sx,ar,bo,br,cl,co,ec,gy,py,pe,sr,uy,ve,al,ad,am,at,by,be,ba,bg,hr,cz,dk,ee,fi,fr,de,gr,hu,is,ie,it,lv,li,lt,lu,mk,mt,md,mc,me,nl,no,pl,pt,ro,ru,sm,rs,sk,si,es,se,ch,tr,ua,uk,va,au,pg,nz,fj,sb,pf,nc,vu,ws,gu,fm,to,ki,as,pw,wf,nr,tv,nu,tk";
        break;
      case "gzip_types":
        formData.value.value =
          "text/plain text/css text/xml text/javascript application/javascript application/x-javascript application/json";
        break;
      case "proxy_ssl_protocols":
        formData.value.value = "TLSv1 TLSv1.1 TLSv1.2";
        break;
      case "ups_keepalive_timeout":
        formData.value.value = 5;
        break;
      case "https_listen-ssl_protocols":
        formData.value.value =
          sslProtocolsRadio.value === "old"
            ? "TLSv1 TLSv1.1 TLSv1.2 TLSv1.3"
            : "TLSv1.2 TLSv1.3";
        break;
      case "https_listen-ssl_ciphers":
        formData.value.value =
          sslProtocolsRadio.value === "old"
            ? "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384:DHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA:ECDHE-RSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES256-SHA256:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:DES-CBC3-SHA"
            : "ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384";
        break;
      case "https_listen-ssl_prefer_server_ciphers":
        formData.value.value = sslProtocolsRadio.value === "old" ? "on" : "off";
        break;
      case "proxy_timeout":
        formData.value.value = 60;
        break;
    }
  }
);

const cacheTableData = ref([]);
const reqHeaderTableData = ref([]);
const sslProtocolsRadio = ref("old");

const handleSubmit = async () => {
  let value = formData.value;
  switch (formData.value.name) {
    case "proxy_cache":
      value = JSON.stringify(cacheTableData.value);
      break;
    case "req_header":
      value = JSON.stringify(reqHeaderTableData.value);
      break;
    case "https_listen-hsts":
    case "https_listen-http2":
    case "https_listen-http3":
    case "https_listen-force_ssl_enable":
    case "send_real_time":
    case "recv_real_time":
    case "block_proxy":
    case "websocket_enable":
    case "gzip_enable":
    case "range":
    case "ups_keepalive":
    case "https_listen-ocsp_stapling":
      value = +formData.value.value;
      break;
  }
  const data = {
    ...formData.value,
    type: "site",
    scope_id:
      formData.value.scope_name === "global" ? 0 : formData.value.scope_id,
    value
  };
  if (formData.value.id) {
    await editDefaultSite(formData.value.id, data);
  } else {
    await creteDefaultSite(data);
  }
  ElMessage.success("操作成功");
  modal.value = false;
  formData.value = {};
  getList();
};

const handleEdit = row => {
  formData.value = { ...row };
  switch (formData.value.name) {
    case "proxy_cache":
      cacheTableData.value = JSON.parse(formData.value.value);
      break;
    case "req_header":
      reqHeaderTableData.value = JSON.parse(formData.value.value);
      break;
    case "https_listen-hsts":
    case "https_listen-http2":
    case "https_listen-http3":
    case "https_listen-force_ssl_enable":
    case "send_real_time":
    case "recv_real_time":
    case "block_proxy":
    case "websocket_enable":
    case "gzip_enable":
    case "range":
    case "ups_keepalive":
    case "https_listen-ocsp_stapling":
      formData.value.value = !!formData.value.value;
      break;
  }
  modal.value = true;
};

const handleDelete = async id => {
  await deleteDefaultSite(id);
  ElMessage.success("操作成功");
  getList();
};

const selection = ref([]);
const handleBatchOption = async type => {
  if (!selection.value.length) {
    ElMessage.error("没有可选项");
    return;
  }

  if (["enable", "disable"].includes(type)) {
    await optionDefaultSite(
      selection.value.map(i => ({ id: i, enable: type === "enable" ? 1 : 0 }))
    );
  }
  if (type === "delete") {
    await deleteDefaultSite(selection.value.toString());
  }

  ElMessage.success("操作成功");
  getList();
};

onMounted(async () => {
  isLoading.value = true;
  try {
    ({ data: siteGroupList.value } = await getSiteGroupList({ limit: 0 }));
    ({ data: getDNSAPIList.value } = await getDNSAPIList({ limit: 0 }));
    await getList();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="h-full bg-white rounded-xl p-4 flex flex-col gap-y-4">
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <el-button size="small" type="primary" @click="modal = true"
          >新增</el-button
        >
        <el-button size="small" type="info" @click="handleBatchOption('enable')"
          >启用
        </el-button>
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
      <el-table-column label="套餐" show-overflow-tooltip>
        <template #default="{ row }">
          {{ configList.find(i => i.value === row.name)?.label }}
        </template>
      </el-table-column>
      <el-table-column label="设置值" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.name === "proxy_cache" ? "点击右侧按钮查看" : row.value }}
        </template>
      </el-table-column>
      <el-table-column label="生效范围" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.scope_name === "global" ? "全局" : "网站分组" }}
        </template>
      </el-table-column>
      <el-table-column label="状态" show-overflow-tooltip>
        <template #default="{ row }">
          {{ row.enable === 1 ? "已开启" : "未开启" }}
        </template>
      </el-table-column>
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
      :title="formData.id ? '编辑网站' : '新增网站'"
      append-to-body
      @closed="formData = {}"
    >
      <el-form :model="formData" label-width="100">
        <el-form-item label="设置项">
          <el-select v-model="formData.name">
            <el-option
              v-for="item of configList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设置值">
          <CacheSetting
            v-if="formData.name === 'proxy_cache'"
            class="flex-1"
            :cache-table-data="cacheTableData"
            @create="cacheTableData.push($event)"
            @delete="cacheTableData.splice($event, 1)"
          />
          <div
            v-if="
              [
                'http_listen-port',
                'https_listen-port',
                'backend_http_port',
                'backend_https_port'
              ].includes(formData.name)
            "
            class="flex-1 flex gap-x-4"
          >
            <el-input v-model="formData.value" style="flex: 1" />
            <div class="text-slate-500 text-nowrap">端口号1到65535</div>
          </div>
          <el-switch
            v-if="
              [
                'https_listen-hsts',
                'https_listen-http2',
                'https_listen-http3',
                'https_listen-force_ssl_enable',
                'send_real_time',
                'recv_real_time',
                'block_proxy',
                'websocket_enable',
                'gzip_enable',
                'range',
                'ups_keepalive',
                'https_listen-force_ssl_enable',
                'https_listen-ocsp_stapling'
              ].includes(formData.name)
            "
            v-model="formData.value"
          />
          <el-radio-group
            v-if="formData.name === 'proxy_http_version'"
            v-model="formData.value"
          >
            <el-radio label="HTTP 1.0" value="1.0" />
            <el-radio label="HTTP 1.1" value="1.1" />
          </el-radio-group>
          <div
            v-if="formData.name === 'proxy_timeout'"
            class="flex-1 flex gap-x-4"
          >
            <el-input v-model="formData.value" style="flex: 1" />
            <div class="text-slate-500 text-nowrap">单位为秒</div>
          </div>
          <el-radio-group
            v-if="formData.name === 'backend_protocol'"
            v-model="formData.value"
          >
            <el-radio label="HTTP" value="http" />
            <el-radio label="HTTPS" value="https" />
            <el-radio label="跟随协议" value="follow" />
          </el-radio-group>
          <div
            v-if="
              [
                'https_listen-ssl_ciphers',
                'https_listen-ssl_protocols',
                'https_listen-ssl_prefer_server_ciphers'
              ].includes(formData.name)
            "
            class="space-y-4"
          >
            <el-radio-group v-model="sslProtocolsRadio">
              <el-radio label="兼容旧浏览器(安全性降低)" value="old" />
              <el-radio label="兼容大部分浏览器(更安全)" value="new" />
            </el-radio-group>
            <el-input v-model="formData.value" />
          </div>
          <reqHeaderSetting
            v-if="formData.name === 'req_header'"
            class="flex-1"
            :req-header-table-data="reqHeaderTableData"
            @create="reqHeaderTableData.push($event)"
            @delete="reqHeaderTableData.splice($event, 1)"
          />
          <el-select
            v-if="formData.name === 'balance_way'"
            v-model="formData.value"
          >
            <el-option value="rr" label="轮询" />
            <el-option value="ip_hash" label="ip_hash" />
          </el-select>
          <el-select
            v-if="formData.name === 'cc_default_rule'"
            v-model="formData.value"
          >
            <el-option value="6" label="宽松" />
            <el-option value="1" label="JS验证" />
            <el-option value="10001" label="5秒盾" />
            <el-option value="10000" label="点击验证" />
            <el-option value="2" label="滑块验证" />
            <el-option value="4" label="验证码" />
            <el-option value="10003" label="旋转图片" />
          </el-select>
          <el-input
            v-if="
              [
                'proxy_ssl_protocols',
                'gzip_types',
                'ups_keepalive_timeout'
              ].includes(formData.name)
            "
            v-model="formData.value"
          />
          <div
            v-if="formData.name === 'post_size_limit'"
            class="flex-1 flex gap-x-4"
          >
            <el-input v-model="formData.value" style="flex: 1" />
            <div class="text-slate-500 text-nowrap">单位为MB</div>
          </div>
          <template v-if="formData.name === 'block_region'">
            <el-input v-model="formData.value" type="textarea" :rows="4" />
            <div class="text-slate-500">
              默认值为屏蔽国外,国家代码参考：https://help.bing.microsoft.com/#apex/bing/zh-CHS/10004/-1
            </div>
          </template>
          <el-input
            v-if="['white_ip', 'black_ip'].includes(formData.name)"
            v-model="formData.value"
            type="textarea"
            :rows="4"
          />
          <el-radio-group
            v-if="formData.name === 'spider_allow'"
            v-model="formData.value"
          >
            <el-radio label="放行" value="allow" />
            <el-radio label="拦截" value="deny" />
            <el-radio label="不设置" value="" />
          </el-radio-group>
          <el-select
            v-if="formData.name === 'dns_api'"
            v-model="formData.value"
          >
            <el-option
              v-for="item of dnsApiList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生效范围">
          <el-select v-model="formData.scope_name">
            <el-option label="全局" value="global" />
            <el-option label="网站分组" value="group" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.scope_name === 'group'" label="网站分组">
          <el-select v-model="formData.scope_id">
            <el-option
              v-for="item of siteGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
