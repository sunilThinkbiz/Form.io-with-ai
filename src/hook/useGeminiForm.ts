// hooks/useGeminiForm.ts
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { enforceRulesOnComponents } from "../utils/rulesEngine";
import { AI_SAVE_DATA } from "../AppConstant";
import { defaultValues } from "../common/defaultValuesJson";

interface Component {
  type?: string;
  key?: string;
  [key: string]: any;
}

export const useGeminiForm = (
  existingComponents: Component[],
  formFields: Component[],
  addGeneratedComponents: (components: Component[]) => void
) => {
  const [prompt, setPrompt] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pendingComponents, setPendingComponents] = useState<Component[] | null>(null);
  const [pendingGeminiComponents, setPendingGeminiComponents] = useState<Component[] | null>(null);
  const [acceptedUnmatchedKeys, setAcceptedUnmatchedKeys] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

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
    const reordered = updated.map((c) => ({ ...existingMap.get(c.key), ...c }));
    const leftover = existingComponents.filter((c) => !updatedKeys.includes(c.key));
    return [...reordered, ...leftover];
  };

  const handleSend = async () => {
    const userInput = prompt.trim();
    if (!userInput) return;

    setChatHistory((prev) => [...prev, userInput]);
    setPrompt("");
    setLoading(true);
    setError("");

    const normalizedInput = userInput.toLowerCase();

    if (pendingComponents && pendingGeminiComponents) {
      if (["yes", "はい"].includes(normalizedInput)) {
        const valid = enforceRulesOnComponents(pendingComponents, setError);
        addGeneratedComponents(valid);
        setAcceptedUnmatchedKeys((prev) => [
          ...prev,
          ...valid
            .map((c) => c.key)
            .filter((key): key is string => typeof key === "string"),
        ]);
      } else if (["no", "いいえ"].includes(normalizedInput)) {
        const filtered = pendingGeminiComponents.filter(
          (c) => !pendingComponents.some((un) => un.key === c.key)
        );
        addGeneratedComponents(filtered);
      } else {
        setError("Please reply with 'yes' or 'no' to confirm unmatched fields.");
        setLoading(false);
        return;
      }

      setPendingComponents(null);
      setPendingGeminiComponents(null);
      setLoading(false);
      return;
    }

    const isJapanesePrompt = (text: string = "") => /[\u3000-\u303F\u3040-\u30FF\u4E00-\u9FAF]/.test(text);
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
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(AI_SAVE_DATA, {
        prompt: userInput,
        existingSchema: {
          display: "form",
          components: existingComponents || [],
        },
      });

      const components = res?.data?.formSchema?.components || [];

      if (components.length === 0) {
        setError("❌ No components received from AI.");
        return;
      }

      const matched = matchFormFields(components);
      const unmatched = components.filter(
        (c: any) => !matched.includes(c) && !acceptedUnmatchedKeys.includes(c.key)
      );

      if (unmatched.length > 0) {
        toast.info("⚠️ Some fields do not match the selected file. Please confirm.");
        setError(
          `Some fields are not recognized: ${unmatched
            .map((c: any) => c.key || c.type)
            .join(", ")}. Reply with \"yes\" to add them or \"no\" to ignore.`
        );
        setPendingComponents(unmatched);
        setPendingGeminiComponents(components);
      } else {
        const reordered = reorderComponents(components);
        const valid = enforceRulesOnComponents(reordered, setError);
        addGeneratedComponents(valid);
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
