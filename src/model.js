export const ccFilterList = [
  {
    label: "请求速率",
    value: "req_rate"
  },
  {
    label: "302跳转",
    value: "302_challenge"
  },
  {
    label: "浏览器识别",
    value: "browser_verify_auto"
  },
  {
    label: "滑动验证",
    value: "slide_filter"
  },
  {
    label: "验证码",
    value: "captcha_filter"
  },
  {
    label: "URL鉴权",
    value: "url_auth"
  },
  {
    label: "点击验证",
    value: "click_filter"
  }
];

export const dnsApiList = [
  {
    label: "CloudFlare",
    value: "CloudFlare"
  },
  {
    label: "DNSPod.cn",
    value: "DNSPod.cn"
  },
  {
    label: "DNSPod.com",
    value: "DNSPod.com"
  },
  {
    label: "DNS.LA",
    value: "DNS.LA"
  },
  {
    label: "GoDaddy.com",
    value: "GoDaddy.com"
  },
  {
    label: "Aliyun",
    value: "Aliyun"
  },
  {
    label: "cloudns.net",
    value: "cloudns.net"
  },
  {
    label: "Name.com",
    value: "Name.com"
  },
  {
    label: "Namecheap",
    value: "Namecheap"
  },
  {
    label: "jdcloud.com",
    value: "jdcloud.com"
  },
  {
    label: "Namesilo.com",
    value: "Namesilo.com"
  },
  {
    label: "DNS.COM",
    value: "DNS.COM"
  },
  {
    label: "dnsdun",
    value: "dnsdun"
  }
];

export const aclMatchList = [
  {
    label: "域名",
    value: "host"
  },
  {
    label: "IP地址",
    value: "ip"
  },
  {
    label: "请求URI",
    value: "req_uri"
  },
  {
    label: "请求URI(不带参数)",
    value: "uri"
  },
  {
    label: "请求方法",
    value: "req_method"
  },
  {
    label: "浏览器UA",
    value: "user_agent"
  },
  {
    label: "请求来源",
    value: "referer"
  },
  {
    label: "国家代码",
    value: "country_iso_code"
  },
  {
    label: "accept_language",
    value: "accept_language"
  },
  {
    label: "AS号码",
    value: "asnumber"
  },
  {
    label: "省份(中文)",
    value: "province"
  },
  {
    label: "城市(中文)",
    value: "city"
  },
  {
    label: "运营商(中文)",
    value: "isp"
  }
];

export const aclMatchOperatorList = [
  {
    label: "等于",
    value: "="
  },
  {
    label: "不等于",
    value: "!="
  },
  {
    label: "包含",
    value: "contain"
  },
  {
    label: "不包含",
    value: "!contain"
  },
  {
    label: "前缀匹配",
    value: "prefix"
  },
  {
    label: "后缀匹配",
    value: "suffix"
  },
  {
    label: "正则匹配",
    value: "regex"
  }
];

export const regionList = [
  {
    label: "不设置",
    value: ""
  },
  {
    label: "国外(不包含港澳台)",
    value:
      "mn,kp,kr,jp,vn,la,kh,th,mm,my,sg,id,bn,ph,tl,in,bd,bt,np,pk,lk,mv,sa,qa,bh,kw,ae,om,ye,ge,lb,sy,il,ps,jo,iq,ir,af,cy,az,tm,tj,kg,uz,kz,dz,ao,bj,bw,bf,bi,cm,cv,cf,td,km,ci,cd,dj,eg,gq,er,et,ga,gm,gh,gn,gw,ke,ls,lr,ly,mg,mw,ml,mr,mu,ma,mz,na,ne,ng,cg,rw,st,sn,sc,sl,so,za,sd,ss,tz,tg,tn,ug,zm,zw,ag,bs,bb,bz,ca,cr,cu,dm,do,sv,ai,bm,gl,gd,gp,gt,ht,hn,jm,mq,mx,ms,aw,cw,ni,pa,kn,lc,vc,tt,tc,us,mf,pr,bl,sx,ar,bo,br,cl,co,ec,gy,py,pe,sr,uy,ve,al,ad,am,at,by,be,ba,bg,hr,cz,dk,ee,fi,fr,de,gr,hu,is,ie,it,lv,li,lt,lu,mk,mt,md,mc,me,nl,no,pl,pt,ro,ru,sm,rs,sk,si,es,se,ch,tr,ua,uk,va,au,pg,nz,fj,sb,pf,nc,vu,ws,gu,fm,to,ki,as,pw,wf,nr,tv,nu,tk"
  },
  {
    label: "国外(包括港澳台)",
    value:
      "hk,mo,tw,mn,kp,kr,jp,vn,la,kh,th,mm,my,sg,id,bn,ph,tl,in,bd,bt,np,pk,lk,mv,sa,qa,bh,kw,ae,om,ye,ge,lb,sy,il,ps,jo,iq,ir,af,cy,az,tm,tj,kg,uz,kz,dz,ao,bj,bw,bf,bi,cm,cv,cf,td,km,ci,cd,dj,eg,gq,er,et,ga,gm,gh,gn,gw,ke,ls,lr,ly,mg,mw,ml,mr,mu,ma,mz,na,ne,ng,cg,rw,st,sn,sc,sl,so,za,sd,ss,tz,tg,tn,ug,zm,zw,ag,bs,bb,bz,ca,cr,cu,dm,do,sv,ai,bm,gl,gd,gp,gt,ht,hn,jm,mq,mx,ms,aw,cw,ni,pa,kn,lc,vc,tt,tc,us,mf,pr,bl,sx,ar,bo,br,cl,co,ec,gy,py,pe,sr,uy,ve,al,ad,am,at,by,be,ba,bg,hr,cz,dk,ee,fi,fr,de,gr,hu,is,ie,it,lv,li,lt,lu,mk,mt,md,mc,me,nl,no,pl,pt,ro,ru,sm,rs,sk,si,es,se,ch,tr,ua,uk,va,au,pg,nz,fj,sb,pf,nc,vu,ws,gu,fm,to,ki,as,pw,wf,nr,tv,nu,tk"
  },
  {
    label: "中国(包括港澳台)",
    value: "cn,hk,mo,tw"
  },
  {
    label: "中国(不包括港澳台)",
    value: "cn"
  }
];

export const messageList = [
  {
    label: "带宽超限",
    value: "bandwidth-exceed"
  },
  {
    label: "连接数超限",
    value: "coesnnection-exceed"
  },
  {
    label: "规则自动切换",
    value: "cc-switch"
  },
  {
    label: "套餐已过期",
    value: "package-expire"
  },
  {
    label: "套餐即将过期",
    value: "package-expiring"
  },
  {
    label: "证书已过期",
    value: "cert-expire"
  },
  {
    label: "证书即将过期",
    value: "cert-expiring"
  }
];
