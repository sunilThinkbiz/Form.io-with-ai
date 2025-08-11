// hooks/useGeminiForm.ts
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { enforceRulesOnComponents } from "../utils/rulesEngine";
import { AI_SAVE_DATA } from "../AppConstant";
import { defaultValues } from "../common/defaultValuesJson";

import { USER, AI, YES_RESPONSES, NO_RESPONSES } from "../AppConstant";

type MessageType = "user" | "ai";

interface Component {
  type?: string;
  key?: string;
  [key: string]: any;
}
interface ChatMessage {
  type: MessageType;
  content: string;
}
const API_URL = process.env.REACT_APP_NODE_SERVER_PORT;
export const useGeminiForm = (
  existingComponents: Component[],
  formFields: Component[],
  addGeneratedComponents: (components: Component[]) => void
) => {
  const [prompt, setPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingComponents, setPendingComponents] = useState<
    Component[] | null
  >(null);
  const [pendingGeminiComponents, setPendingGeminiComponents] = useState<
    Component[] | null
  >(null);
  const [acceptedUnmatchedKeys, setAcceptedUnmatchedKeys] = useState<string[]>(
    []
  );

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const addChatMessage = (type: "user" | "ai", content: string) => {
    setChatHistory((prev) => [...prev, { type, content }]);
  };

  const enforceRules = (components: Component[]) =>
    enforceRulesOnComponents(components, setError);

  const matchFormFields = (components: Component[]): Component[] => {
    const keys = formFields.map((f) => (f.key || f.type || "").toLowerCase());
    return components.filter((comp) => {
      const type = (comp.type || "").toLowerCase();
      const key = (comp.key || "").toLowerCase();
      return keys.includes(type) || keys.includes(key);
    });
  };

  const reorderComponents = (updated: Component[]): Component[] => {
    const updatedKeys = updated.map((c) => c.key);
    const existingMap = new Map(existingComponents.map((c) => [c.key, c]));

    const reordered = updated.map((c) => {
      const existing = existingMap.get(c.key);
      return existing ? { ...existing, ...c } : c;
    });

    const leftover = existingComponents.filter(
      (c) => !updatedKeys.includes(c.key)
    );

    return [...reordered, ...leftover];
  };

  const handleSend = async () => {
    const userInput = prompt.trim();
    if (!userInput) return;
    addChatMessage(USER, userInput);
    setPrompt("");
    setLoading(true);
    setError("");

    const normalizedInput = userInput.toLowerCase();
    if (pendingComponents && pendingGeminiComponents) {
      if (YES_RESPONSES.includes(normalizedInput)) {
        const validMatched = enforceRules(pendingComponents);
        const unmatchedField = validMatched.map((v) => v.label);
        addGeneratedComponents(validMatched);
        setAcceptedUnmatchedKeys((prev) => [
          ...prev,
          ...validMatched
            .map((c) => c.key)
            .filter((key): key is string => typeof key === "string"),
        ]);
        addChatMessage(
          AI,
          `✅ ${unmatchedField} added successfully. What would you like to add next?`
        );
      } else if (NO_RESPONSES.includes(normalizedInput)) {
        const filtered = pendingGeminiComponents.filter(
          (c) => !pendingComponents.some((un) => un.key === c.key)
        );
        addGeneratedComponents(filtered);
      } else {
        setError(
          "Please reply with 'yes' or 'no' to confirm unmatched fields."
        );
        setLoading(false);
        return;
      }

      setPendingComponents(null);
      setPendingGeminiComponents(null);
      setLoading(false);
      return;
    }

    const isJapanesePrompt = (text: string = "") =>
      /[\u3000-\u303F\u3040-\u30FF\u4E00-\u9FAF]/.test(text);
    const normalize = (text: string = "") => text.replace(/\s+/g, "").trim();

    const language = isJapanesePrompt(userInput) ? "jp" : "en";

    const requestedDefaults = defaultValues.filter((field) => {
      const input = normalize(userInput);
      const fieldKey = normalize(field.key);
      const fieldLabels = Object.values(field.label || {}).map(normalize);
      const fieldAliases = (field.aliases || []).map(normalize);

      return (
        input.includes(fieldKey) ||
        fieldLabels.some((label) => input.includes(label)) ||
        fieldAliases.some((alias) => input.includes(alias))
      );
    });

    const finalFields = requestedDefaults.map((field) => ({
      ...field,
      label: field.label[language] || field.label.en,
    }));

    if (finalFields.length > 0) {
      addGeneratedComponents(finalFields);
      return setLoading(false);
    }

    try {
      const res = await axios.post(`${API_URL}${AI_SAVE_DATA}`, {
        prompt: userInput,
        existingSchema: {
          display: "form",
          components: existingComponents || [],
        },
      });

      const components = res?.data?.formSchema?.components || [];
      if (components.length === 0) {
        return setError("❌ No components received from AI.");
      }

      // Corrected version
      const matched = matchFormFields(components);

      const updatedFields = matched.filter((newField) => {
        const existingField = existingComponents.find(
          (c) => c.key === newField.key
        );
        return (
          existingField &&
          JSON.stringify(existingField) !== JSON.stringify(newField)
        );
      });

      const updateFieldNames = updatedFields.map((f) => f.label);

      //after new field added

      const newField = components.find(
        (c: any) => !existingComponents.some((v) => v.key === c.key)
      );

      const already = components.find((c: any) =>
        existingComponents.some((v) => v.key === c.key)
      );

      const unmatched = components.filter(
        (c: any) =>
          !matched.includes(c) && !acceptedUnmatchedKeys.includes(c.key)
      );
      if (unmatched.length > 0) {
        const unmatchedFields = unmatched.map((v: any) => v.label);
        console.log(unmatchedFields);
        addChatMessage(
          AI,
          `⚠️ Some fields are not recognized: ${[
            unmatchedFields,
          ]}. Reply with "yes" to add them or "no" to ignore.`
        );
        setPendingComponents(unmatched);
        setPendingGeminiComponents(components);
      } else {
        const reordered = reorderComponents(components);
        const valid = enforceRules(reordered);
        if (valid.length > 0) {
          addGeneratedComponents(valid);
          const reorderedFields = existingComponents.filter(
            (oldComp, oldIndex) => {
              const newIndex = reordered.findIndex(
                (newComp) => newComp.key === oldComp.key
              );
              return newIndex !== -1 && newIndex !== oldIndex; // same field, different position
            }
          );

          if (updatedFields.length > 0) {
            addChatMessage(AI, `✅ ${updateFieldNames} updated successfully.`);
          } else if (newField) {
            console.log(newField);
            if (newField === undefined) {
              addGeneratedComponents([]);
              addChatMessage(AI, `field not created please add prompt currect`);
            } else {
              addChatMessage(
                AI,
                `✅ ${newField.label || newField.key} added successfully.`
              );
            }
          } else if (reorderedFields.length > 0) {
            const movedLabels = reorderedFields.map(
              (f) => f.label || f.key || "Unnamed field"
            );
            if (movedLabels.length === 1) {
              addChatMessage(AI, `🔄 ${movedLabels[0]} moved successfully.`);
            } else {
              addChatMessage(
                AI,
                `🔄 ${movedLabels.join(", ")} moved successfully.`
              );
            }
          } else if (already) {
            addChatMessage(AI, "⚠️ This field already exists.");
          }
        } else {
          // ❌ No valid components — enforceRules probably already set an error
          addChatMessage(
            AI,
            `❌ Could not add due to validation errors.`
          );
        }
      }
    } catch (err: any) {
      setError(err?.message || "❌ Error generating form");
    } finally {
      setLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    chatHistory,
    error,
    loading,
    handleSend,
    chatEndRef,
  };
};
