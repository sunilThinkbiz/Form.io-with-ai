// utils/formApi.ts
import axios from "axios";
import { ComponentType } from "../types";
import { API_URL } from "../AppConstant";



export const saveFormToBackend = async (components: ComponentType[]) => {
  return axios.post(API_URL, {
    display: "form",
    components,
  });
};

export const clearFormOnBackend = async () => {
  return axios.post(API_URL, {
    display: "form",
    components: [],
  });
};
