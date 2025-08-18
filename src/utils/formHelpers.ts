// utils/formHelpers.ts
import axios from "axios";
import { ComponentType } from "../types";


export interface Component {
  key?: string;
  type?: string;
  label?: string;
  defaultValue?: any;
  [key: string]: any; // allow extra props
}

const API_URL = process.env.REACT_APP_NODE_SERVER_PORT || "http://localhost:5000";

export function matchFormFields(formFields: Component[], components: Component[]): Component[] {
  const keys = formFields.map((f) => (f.key || f.type || "").toLowerCase());
  return components.filter((comp) => {
    const type = (comp.type || "").toLowerCase();
    const key = (comp.key || "").toLowerCase();
    return keys.includes(type) || keys.includes(key);
  });
}

export const reorderComponents = (
   existingComponents: (ComponentType | any)[],
  updated: (ComponentType | any)[]
): ComponentType[] => {
  const updatedKeys = updated.map((c) => c.key);
  const existingMap = new Map(existingComponents.map((c) => [c.key, c]));

  // Merge updated into existing
  const reordered = updated.map((c) => {
    const existing = existingMap.get(c.key);
    return existing ? { ...existing, ...c } : c;
  });

  // Keep leftover components not touched
  const leftover = existingComponents.filter(
    (c) => !updatedKeys.includes(c.key)
  );

  return [...reordered, ...leftover];
};


export async function generatePrefillForComponent(component: Component, userPrompt: string): Promise<string> {
  try {
    const url = `${API_URL}/api/generate-text`;
    const resp = await axios.post(url, {
      prompt: userPrompt,
      component,
    });
    return resp.data?.text?.trim() || "";
  } catch (err) {
    console.warn("Prefill generation failed", err);
    return "";
  }
}

