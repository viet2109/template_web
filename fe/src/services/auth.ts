import { api } from "./api";

export const login = async (data: any) => {
  api.get("/sanctum/csrf-cookie").then(() => {
    return api.post("/login", data).then((res) => {
      return res.data;
    });
  });
};
