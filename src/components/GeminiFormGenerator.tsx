import React, { useEffect, useRef, useState } from "react";
import { Form } from "@formio/react";
import axios from "axios";

interface Props {
  addGeneratedComponents: (components: any[]) => void;
  existingComponents: any[];
}

const GeminiFormGenerator: React.FC<Props> = ({
  addGeneratedComponents,
  existingComponents,
}) => {
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [generatedForm, setGeneratedForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setChatHistory((prev) => [...prev, prompt]);
    setPrompt("");
    setLoading(true);
    setGeneratedForm(null);

    try {
      const response = await axios.post("http://localhost:5000/api/gemini-generate/save-ai-form", {
        prompt,
        existingSchema: { display: "form", components: existingComponents || [] },
      });

      const data = response.data;
      if (data?.formSchema) {
        setGeneratedForm(data.formSchema);
        if (data.formSchema.components) {
          addGeneratedComponents(data.formSchema.components);
        }
      }
    } catch (err) {
      console.error("Form generation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "800px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        height: "90vh",
        border: "1px solid #ccc",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          padding: "20px",
          background: "#f9f9f9",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: "flex-end",
              background: "#dcf8c6",
              padding: "10px 14px",
              borderRadius: "16px",
              maxWidth: "75%",
              fontSize: "14px",
              whiteSpace: "pre-wrap",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {msg}
          </div>
        ))}

        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              background: "#fff3cd",
              padding: "10px 14px",
              borderRadius: "16px",
              fontSize: "14px",
              color: "#856404",
              maxWidth: "75%",
            }}
          >
            🤖 AI is generating your form...
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #ddd",
          padding: "12px",
          background: "#fff",
          gap: "10px",
        }}
      >
        <textarea
          rows={2}
          value={prompt}
          placeholder="💬 Ask AI to generate a form..."
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{
            flex: 1,
            resize: "none",
            padding: "10px",
            fontSize: "14px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            background: "#4CAF50",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>

      {/* Output Form (not inside chat) */}
      {generatedForm && (
        <div
          style={{
            padding: "20px",
            background: "#fff",
            borderTop: "1px solid #eee",
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          <h4 style={{ marginBottom: "12px" }}>🧾 Generated Form:</h4>
          <Form
            form={generatedForm}
            onSubmit={(s) => console.log("Form submitted:", s)} src={""}          />
        </div>
      )}
    </div>
  );
};

export default GeminiFormGenerator;
