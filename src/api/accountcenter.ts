import { http } from "@/utils/http";
import type { Response } from "./types";

export const getSubscribe = () => {
  return http.get<Response<any>, unknown>("/messages/sub");
};

export const getSubscribeMessage = params => {
  return http.get<Response<any>, unknown>("/messages", params);
};

export const getMyOrderList = params => {
  return http.get<Response<any>, unknown>("/orders", params);
};

export const getSigninList = params => {
  return http.get<Response<any>, unknown>("/log/login", params);
};

export const getActionList = params => {
  return http.get<Response<any>, unknown>("/log/op", params);
};

export const getApiConfig = () => {
  return http.get<Response<any>, unknown>("/api-key");
};

export const putApiConfig = (ip: string) => {
  return http.request<Response<any>>(
    "put",
    "/api-key",
    {},
    {
      data: { ip }
    }
  );
};

export const genApiConfig = () => {
  return http.post<Response<any>, unknown>("/api-key");
};

export const removeApiConfig = () => {
  return http.request<Response<any>>("delete", "/api-key");
};
