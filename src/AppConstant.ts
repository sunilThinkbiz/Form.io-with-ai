export const STORAGE_KEY = "form_builder_components";
export const FORM_API_URL = "/api/forms/save";
export const AI_SAVE_DATA = "/api/gemini-generate/save-ai-form";
export const GENERATE_TEXT="/api/generate-text";

export const USER = "user";
export const AI = "ai";
export const YES_RESPONSES = ["yes", "はい"];
export const NO_RESPONSES = ["no", "いいえ"];
export const LABELS = {
  formBuilder: "Form Builder",
  saveForm: "Save Form",
  clearForm: "Clear Form",
  dragPrompt: "Drag fields to build your form."
};
export const HEADERS={
    askfieldGenerator:"AI Field Generator",
}
export const GEMINIFORM={
AI_LOADING:" 🤖 AI is generating your form...",
PLACEHOLDER:"💬 Ask AI to generate a form...",
}
export const LIVEPRVIEW={
HEADINGLIVEPREVIEW:"Live Preview",
FORMJSON:"Form JSON",
}

export const SIDEBAR={
    FIELDS:"Fields"
}

export const AUTO_GENERATE_FIELD={
 buttonStyle: "generate-btn",
 autogenerateTextArea : "styled-textarea",
 containerClass :"auto-generate-container",
 AUTO_FIELD_KEY : "autoGenerateText",
 GENERATE_BUTTON_KEY : "generateButton",
 AUTO_GENERATE_LABEL:"Auto Generate",
 AUTOGENERATE:"autogenerate",
 GENERATE_DESCRIPTION:"generateDescription",
 TEXT_AREA:"textarea",
 AUTO_GENERATE_TEXT:"autoGenerateText"
}
