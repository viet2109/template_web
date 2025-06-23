import axios from "axios";
import { store } from "../store/store";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3ZWFyZWNoYW1waW9uMjEwOTIwMDNAZ21haWwuY29tIiwiaWF0IjoxNzUwNjU1NzU4LCJleHAiOjE3NTA3NDIxNTh9.vQe1kh2CGgMbqQm4HhpwrMHorcUIWrzdFvHcCk_3KDsQDWONKPy-GsIV3ZqJkUUAEANWThbA87mXu6tG69F7HA`
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
