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
