import { http } from "@/utils/http/index";

export const getDefaultSiteList = params => {
  return http.request("get", "/user-configs", {}, { params });
};

export const creteDefaultSite = data => {
  return http.request("post", "/user-configs", {}, { data });
};

export const editDefaultSite = (id, data) => {
  return http.request("put", `/user-configs/${id}`, {}, { data });
};

export const optionDefaultSite = data => {
  return http.request("put", "/user-configs", {}, { data });
};

export const deleteDefaultSite = id => {
  return http.request("delete", `/user-configs/${id}`);
};
