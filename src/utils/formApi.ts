import axios from "axios";
import { ComponentType } from "../types";
import { FORM_API_URL } from "../AppConstant";

const API_URL = process.env.REACT_APP_NODE_SERVER_PORT;
export const saveFormToBackend = async (components: ComponentType[]) => {
  return axios.post(`${API_URL}${FORM_API_URL}`, {
    display: "form",
    components,
  });
};

export const clearFormOnBackend = async () => {
  return axios.post(`${API_URL}${FORM_API_URL}`, {
    display: "form",
    components: [],
  });
};
