import { http } from "@/utils/http/index";

export const getFourShareList = params => {
  return http.request("get", "/streams", {}, { params });
};

export const createFourShare = data => {
  return http.request("post", "/streams", {}, { data });
};

export const optionFourShare = data => {
  return http.request("put", "/streams", {}, { data });
};

export const editFourShare = (id, data) => {
  return http.request("put", `/streams/${id}`, {}, { data });
};

export const deleteFourShare = id => {
  return http.request("delete", `/streams/${id}`);
};

export const getFourShareDetail = id => {
  return http.request("get", `/streams/${id}`);
};

export const getFourShareGroup = params => {
  return http.request("get", "/stream-groups", {}, { params });
};

export const createFourShareGroup = data => {
  return http.request("post", "/stream-groups", {}, { data });
};

export const editFourShareGroup = (id, data) => {
  return http.request("put", `/stream-groups/${id}`, {}, { data });
};

export const deleteFourShareGroup = id => {
  return http.request("delete", `/stream-groups/${id}`);
};

export const getStreamStatistics = params => {
  return http.request("get", "/monitor/stream/realtime", {}, { params });
};

export const getStreamPortStatistics = params => {
  return http.request("get", "/monitor/stream/top", {}, { params });
};
