import React from "react";
import { useGeminiForm } from "../hook/useGeminiForm";
import "../assets/styles/GeminiFormGenerator.css";
import { GEMINIFORM } from "../AppConstant";

interface Props {
  addGeneratedComponents: (components: any[]) => void;
  existingComponents: any[];
  FormFeilds: any[];
}

const GeminiFormGenerator: React.FC<Props> = ({
  addGeneratedComponents,
  existingComponents,
  FormFeilds,
}) => {
  const {
    prompt,
    setPrompt,
    chatHistory,
    error,
    loading,
    handleSend,
    chatEndRef,
  } = useGeminiForm(existingComponents, FormFeilds, addGeneratedComponents);

  return (
    <div className="gemini-form">
      <div className="gemini-form__chat">
        {chatHistory.map((msg, idx) => (
          <div 
            key={idx} 
            className={`gemini-form__message ${
              msg.type === 'user' ? 'gemini-form__message--user' : 'gemini-form__message--ai'
            }`}
          >
            {msg.type === 'user' ? (
              <div className="gemini-form__user-message">
                <span className="gemini-form__user-icon">👤</span>
                {msg.content}
              </div>
            ) : (
              <div className="gemini-form__ai-message">
                <span className="gemini-form__ai-icon">🤖</span>
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="gemini-form__loading">
           {GEMINIFORM.AI_LOADING}
          </div>
        )}

        {error && <div className="gemini-form__error">{error}</div>}

        <div ref={chatEndRef} />
      </div>

      <div className="gemini-form__input">
        <textarea
          rows={2}
          value={prompt}
          placeholder={GEMINIFORM.PLACEHOLDER}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="gemini-form__textarea"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="gemini-form__send-button"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default GeminiFormGenerator;
