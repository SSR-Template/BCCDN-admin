import { http } from "@/utils/http";

export const getMyPackageList = params => {
  return http.get("/user-packages", params);
};

export const getMyPackageUsage = id => {
  return http.get(`/user-package/${id}/usage`);
};

export const getMyPackageUpgradeList = (id, params) => {
  return http.get(`/user-package/${id}/upgrades`, params);
};

export const getMyPackageChargePrice = (id, params) => {
  return http.get(`/user-packages/${id}`, params);
};

export const chargeMyPackage = (id, data) => {
  return http.request("put", `/user-packages/${id}`, data);
};

export const getPackageList = group => {
  return http.request("get", `/packages?page=1&limit=0&group=${group}&mine=`);
};

export const checkPackage = (id, { duration = "", coupon_code = "" }) => {
  return http.request(
    "get",
    `/packages/${id}?duration=${duration}&coupon_code=${coupon_code}`
  );
};

export const postPackage = data => {
  return http.request("post", "/user-packages", {}, { data });
};
