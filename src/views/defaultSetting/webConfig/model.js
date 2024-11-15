export const configList = [
  {
    label: "网站缓存",
    value: "proxy_cache"
  },
  {
    label: "HTTPS监听端口",
    value: "http_listen-port"
  },
  {
    label: "HTTPS监听端口",
    value: "https_listen-port"
  },
  {
    label: "开启HSTS",
    value: "https_listen-hsts"
  },
  {
    label: "开启HTTP2",
    value: "https_listen-http2"
  },
  {
    label: "开启HTTP3",
    value: "https_listen-http3"
  },
  {
    label: "强制HTTPS",
    value: "https_listen-force_ssl_enable"
  },
  {
    label: "ssl_protocols",
    value: "https_listen-ssl_protocols"
  },
  {
    label: "ssl_ciphers",
    value: "https_listen-ssl_prefer_server_ciphers"
  },
  {
    label: "ssl_prefer_server_ciphers",
    value: "https_listen-ssl_prefer_server_ciphers"
  },
  {
    label: "ocsp_stapling",
    value: "https_listen-ocsp_stapling"
  },
  {
    label: "回源协议",
    value: "backend_protocol"
  },
  {
    label: "回源HTTP端口",
    value: "backend_http_port"
  },
  {
    label: "回源HTTPS端口",
    value: "backend_https_port"
  },
  {
    label: "回源超时",
    value: "proxy_timeout"
  },
  {
    label: "回源HTTP版本",
    value: "proxy_http_version"
  },
  {
    label: "启用回源连接池",
    value: "ups_keepalive"
  },
  {
    label: "连接池最大空闲连接数",
    value: "ups_keepalive_timeout"
  },
  {
    label: "回源SSL协议",
    value: "proxy_ssl_protocols"
  },
  {
    label: "开启Range回源",
    value: "range"
  },
  {
    label: "请求源站头",
    value: "req_header"
  },
  {
    label: "回源负载方式",
    value: "balance_way"
  },
  {
    label: "默认CC规则",
    value: "cc_default_rule"
  },
  {
    label: "开启Gzip",
    value: "gzip_enable"
  },
  {
    label: "Gzip types",
    value: "gzip_types"
  },
  {
    label: "开启WebSocket",
    value: "websocket_enable"
  },
  {
    label: "上传文件大小限制",
    value: "post_size_limit"
  },
  {
    label: "屏蔽透明代理",
    value: "block_proxy"
  },
  {
    label: "数据实时发送",
    value: "send_real_time"
  },
  {
    label: "数据实时返回",
    value: "recv_real_time"
  },
  {
    label: "区域屏蔽",
    value: "block_region"
  },
  {
    label: "白名单IP",
    value: "white_ip"
  },
  {
    label: "黑名单IP",
    value: "black_ip"
  },
  {
    label: "强制HTTPS",
    value: "https_listen-force_ssl_enable"
  },
  {
    label: "搜索引擎爬虫",
    value: "spider_allow"
  },
  {
    label: "DNS API",
    value: "dns_api"
  }
];
