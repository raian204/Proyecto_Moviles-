import axios from "axios";

export const api = axios.create({
  baseURL: "https://6958c0cb6c3282d9f1d5b4e4.mockapi.io",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});
