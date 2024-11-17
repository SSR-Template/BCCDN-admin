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

export const getJobList = params => {
  return http.request("get", "/jobs", {}, { params });
};

export const createJob = data => {
  return http.request("post", "/jobs", {}, { data });
};

export const getSiteRealtimeStatics = params => {
  return http.request("get", "/monitor/site/realtime", {}, { params });
};

export const getSiteTopStatics = params => {
  return http.request("get", "/monitor/site/top", {}, { params });
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
