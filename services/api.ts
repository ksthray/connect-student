import axios, { AxiosInstance } from "axios";

export function getApiUrl(): string {
  const apiUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : process.env.NEXT_PUBLIC_API;
  return `${apiUrl}`;
}

export const apiDavid = "https://agc.iconesrdc.com";

const baseURL = getApiUrl();

const api: AxiosInstance = axios.create({
  baseURL: baseURL + "/api",
  headers: {
    Accept: "application/json",
  },
});

export default api;
