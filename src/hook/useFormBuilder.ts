import { useState } from "react";
import { ComponentType } from "../types";
import { saveFormToBackend, clearFormOnBackend } from "../utils/formApi";
import { toast } from "react-toastify";

export const useFormBuilder = () => {
  const [components, setComponents] = useState<ComponentType[]>([]);
  const handleSaveForm = async () => {
    try {
      await saveFormToBackend(components);
      toast.success("Form saved successfully");
    } catch (error) {
      console.error("Manual save failed", error);
      toast.error("Failed to save form");
    }
    setComponents([])
  };

  const clearForm = async () => {
    try {
      await clearFormOnBackend();
      setComponents([]);
      toast.info("Form cleared");
    } catch (error) {
      toast.error("Failed to clear form");
    }
  };

  const addGeneratedFields = (newFields: ComponentType[]) => {
    setComponents((prevComponents) => {
      const existingMap = new Map(
        prevComponents.map((comp) => [comp.key, comp])
      );
      const updatedKeys = new Set(newFields.map((field) => field.key));
      const merged: ComponentType[] = [];

      newFields.forEach((newField) => {
        const existing = existingMap.get(newField.key);
        if (existing) {
          merged.push({ ...existing, ...newField });
        } else {
          merged.push(newField);
        }
      });

      const remaining = prevComponents.filter(
        (comp) => !updatedKeys.has(comp.key)
      );
      return [...remaining, ...merged];
    });
  };

  const addComponent = (component: ComponentType) => {
    setComponents((prev) => [...prev, component]);
  };

  return {
    components,
    setComponents,
    clearForm,
    addGeneratedFields,
    addComponent,
    handleSaveForm, 
    
  };
};
