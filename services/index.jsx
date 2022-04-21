import axios from "axios";
import { baseApiUrl } from "../constant";

export const Api = axios.create({ baseURL: baseApiUrl });

export const setAuth = (token) => {
  if (token) {
    Api.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete Api.defaults.headers.Authorization;
  }
};
