import { http } from "@/utils/http/index";

export const getUserInfo = () => {
  return http.request("get", "/user");
};

export const getOverview = () => {
  return http.request("get", "/user/overview");
};

export const getMessage = params => {
  return http.request("get", "/messages", {}, { params });
};
