import { http } from "@/utils/http";

export const getSiteList = params => {
  return http.get("/sites", params);
};

export const createSite = data => {
  return http.request("post", "/sites", {}, { data });
};

export const updateSite = data => {
  return http.request("put", "/sites", {}, { data });
};

export const editSite = (id, data) => {
  return http.request("put", `/sites/${id}`, {}, { data });
};

export const deleteSite = id => {
  return http.request("delete", `/sites/${id}`);
};

export const getSiteDetail = id => {
  return http.request("get", `/sites/${id}`);
};

export const certSite = data => {
  return http.request("post", "/certs", {}, { data });
};

export const clearSite = data => {
  return http.request("post", "/jobs", {}, { data });
};

export const getSiteGroupList = params => {
  return http.get("/site-groups", params);
};

export const createSiteGroup = data => {
  return http.request("post", "/site-groups", {}, { data });
};

export const editSiteGroup = (id, data) => {
  return http.request("put", `/site-groups/${id}`, {}, { data });
};

export const deleteSiteGroup = id => {
  return http.request("delete", `/site-groups/${id}`);
};

export const getCertList = params => {
  return http.get("/certs", params);
};

export const createCert = data => {
  return http.request("post", "/certs", {}, { data });
};

export const getCertDetail = id => {
  return http.request("get", `/certs/${id}`);
};

export const editCert = (id, data) => {
  return http.request("put", `/certs/${id}`, {}, { data });
};

export const optionCert = data => {
  return http.request("put", "/certs", {}, { data });
};

export const deleteCert = id => {
  return http.request("delete", `/certs/${id}`);
};

export const getJobList = params => {
  return http.request("get", "/jobs", {}, { params });
};

export const createJob = data => {
  return http.request("post", "/jobs", {}, { data });
};

export const getCCRuleList = params => {
  return http.request("get", "/cc-rules", {}, { params });
};

export const createCCRule = data => {
  return http.request("post", "/cc-rules?internal=0", {}, { data });
};

export const optionCCRule = data => {
  return http.request("put", "/cc-rules", {}, { data });
};

export const editCCRule = (id, data) => {
  return http.request("put", `/cc-rules/${id}`, {}, { data });
};

export const deleteCCRule = id => {
  return http.request("delete", `/cc-rules/${id}`);
};

export const getCCMatchList = params => {
  return http.request("get", "/cc-matchs", {}, { params });
};

export const createCCMather = data => {
  return http.request("post", "/cc-matchs?internal=0", {}, { data });
};

export const optionCCMather = data => {
  return http.request("put", "/cc-matchs", {}, { data });
};

export const editCCMather = (id, data) => {
  return http.request("put", `/cc-matchs/${id}`, {}, { data });
};

export const deleteCCMather = id => {
  return http.request("delete", `/cc-matchs/${id}`);
};

export const getCCFilterList = params => {
  return http.request("get", "/cc-filters", {}, { params });
};

export const createCCFilter = data => {
  return http.request("post", "/cc-filters?internal=0", {}, { data });
};

export const optionCCFilter = data => {
  return http.request("put", "/cc-filters", {}, { data });
};

export const editCCFilter = (id, data) => {
  return http.request("put", `/cc-filters/${id}`, {}, { data });
};

export const deleteCCFilter = id => {
  return http.request("delete", `/cc-filters/${id}`);
};

export const getSiteRealtimeStatics = params => {
  return http.request("get", "/monitor/site/realtime", {}, { params });
};

export const getSiteTopStatics = params => {
  return http.request("get", "/monitor/site/top", {}, { params });
};

export const getBlackList = params => {
  return http.request("get", "/monitor/site/blackip", {}, { params });
};

export const getBlackListStatics = () => {
  return http.request("get", "/monitor/site/blackip-count");
};

export const getLogList = params => {
  return http.request("get", "/monitor/site/access-log", {}, { params });
};

export const getDomainList = params => {
  return http.request("get", "/domains", {}, { params });
};

export const optionDomain = data => {
  return http.request("post", "/domains", {}, { data });
};

export const getDNSAPIList = params => {
  return http.get("/dnsapis", params);
};

export const createDNSAPI = data => {
  return http.request("post", "/dnsapis", {}, { data });
};

export const editDNSAPI = (id, data) => {
  return http.request("put", `/dnsapis/${id}`, {}, { data });
};

export const deleteDNSAPI = id => {
  return http.request("delete", `/dnsapis/${id}`);
};

export const getACLList = params => {
  return http.request("get", "/acls", {}, { params });
};

export const createACL = data => {
  return http.request("post", "/acls", {}, { data });
};

export const optionACL = data => {
  return http.request("put", "/acls", {}, { data });
};

export const editACL = (id, data) => {
  return http.request("put", `/acls/${id}`, {}, { data });
};

export const deleteACL = id => {
  return http.request("delete", `/acls/${id}`);
};
