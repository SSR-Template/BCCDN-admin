import { http } from "@/utils/http";
import type { Response } from "./types";

export const getSubscribe = () => {
  return http.get<Response<any>, unknown>("/messages/sub");
};
