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

export const getCertList = params => {
  return http.get("/certs", params);
};
