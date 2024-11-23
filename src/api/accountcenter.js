import { http } from "@/utils/http";

export const getSubscribe = () => {
  return http.get("/messages/sub");
};

export const getSubscribeMessage = params => {
  return http.get("/messages", params);
};

export const getSubscribeMessageDetail = id => {
  return http.request("get", `/messages/${id}`);
};

export const getMyOrderList = params => {
  return http.get("/orders", params);
};

export const getSigninList = params => {
  return http.get("/log/login", params);
};

export const getActionList = params => {
  return http.get("/log/op", params);
};

export const getApiConfig = () => {
  return http.get("/api-key");
};

export const putApiConfig = ip => {
  return http.request(
    "put",
    "/api-key",
    {},
    {
      data: { ip }
    }
  );
};

export const genApiConfig = () => {
  return http.post("/api-key");
};

export const removeApiConfig = () => {
  return http.request("delete", "/api-key");
};
