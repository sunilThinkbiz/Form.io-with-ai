import axios from "axios";
import React, { useCallback, useRef, useState } from "react";
import { ComponentType } from "../types";
import { GENERATE_TEXT, AUTO_GENERATE_FIELD } from "../AppConstant";

interface UseAutogenerateProps {
  components: ComponentType[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentType[]>>;
}
const API_URL = process.env.REACT_APP_NODE_SERVER_PORT;
const useAutogenerate = ({
  components,
  setComponents,
}: UseAutogenerateProps) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const formRef = useRef<any>(null); // formio instance
  const {
    AUTO_GENERATE_LABEL,
    AUTOGENERATE,
    GENERATE_DESCRIPTION,
    TEXT_AREA,
    AUTO_GENERATE_TEXT,
  } = AUTO_GENERATE_FIELD;
  // 🔹 Generate description based on title
  const handleGenerateClick = async (descKey: string) => {
    const titleComponent = components.find(
      (c) => c.label?.toLowerCase() === "title"
    );

    const titleKey = titleComponent?.key;
    const titleValue = titleKey ? formData[titleKey] : "";

    if (!titleValue) {
      alert("Please enter a title before generating.");
      return;
    }

    try {
      setLoadingKey(descKey);

      const res = await axios.post(`${API_URL}${GENERATE_TEXT}`, {
        prompt: `give the description of ${titleValue}`,
        component: { key: descKey, label: AUTO_GENERATE_LABEL },
        mode: AUTOGENERATE,
      });

      const newText =
        typeof res.data === "string" ? res.data.trim() : res.data?.text || "";

      // update local form data
      setFormData((prev) => ({
        ...prev,
        [descKey]: newText,
      }));

      // update formio field directly
      if (formRef.current) {
        formRef.current.setValue(descKey, newText);
      }

      // update schema defaultValue
      setComponents((prev) =>
        prev.map((c) =>
          c.key === descKey ? { ...c, defaultValue: newText } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to generate description");
    } finally {
      setLoadingKey(null);
    }
  };
  const handleCustomEvent = (event: any) => {
    if (event.type === GENERATE_DESCRIPTION) {
      // recursive search for textarea
      const findAutoField = (comps: any[]): any => {
        for (let comp of comps) {
          if (comp.type === TEXT_AREA && comp.key === AUTO_GENERATE_TEXT) {
            return comp;
          }
          if (comp.components) {
            const found = findAutoField(comp.components);
            if (found) return found;
          }
          if (comp.columns) {
            for (let col of comp.columns) {
              const found = findAutoField(col.components);
              if (found) return found;
            }
          }
        }
        return null;
      };

      const autoField = findAutoField(components);

      if (autoField?.key) {
        handleGenerateClick(autoField.key);
      }
    }
  };
  const handleFormChange = useCallback((changed: any) => {
    setFormData(changed.data);
  }, []);

  return {
    handleGenerateClick,
    formData,
    handleFormChange,
    formRef,
    loadingKey,
    handleCustomEvent,
  };
};

export default useAutogenerate;
