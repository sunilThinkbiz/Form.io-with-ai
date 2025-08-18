import { Form } from "@formio/react";
import React from "react";
import { ComponentType } from "../types";
import { LABELS } from "../AppConstant";
import "../assets/styles/FormBuilder.css";
import useAutogenerate from "../hook/useAutogenerate";

interface DropzoneProps {
  components: ComponentType[];
  setComponents: React.Dispatch<React.SetStateAction<ComponentType[]>>;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  formSchema: { display: "form"; components: ComponentType[] };
  handleSaveForm: () => void;
  clearForm: () => void;
}

const Dropzone: React.FC<DropzoneProps> = ({
  components,
  handleDrop,
  handleDragOver,
  formSchema,
  handleSaveForm,
  clearForm,
  setComponents,
}) => {
  const {
    formData,
    handleFormChange,
    formRef,
    loadingKey,
    handleCustomEvent,
  } = useAutogenerate({ components, setComponents });
  return (
    <section
      className="form-builder-dropzone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h3>{LABELS.formBuilder}</h3>

      {components.length === 0 ? (
        <p>{LABELS.dragPrompt}</p>
      ) : (
        <div className="description-container">
          <Form
            form={formSchema}
            submission={{ data: formData }}
            onChange={handleFormChange}
            src=""
            onFormLoad={(formio) => {
              formRef.current = formio;
            }}
            onCustomEvent={(event: any) => {
             handleCustomEvent(event)
            }}
          />

          {/* Show loader when generating */}
          {loadingKey && (
            <p style={{ color: "blue", marginTop: "8px" }}>
              Generating description...
            </p>
          )}
        </div>
      )}

      <button onClick={handleSaveForm} className="save-form-button">
        {LABELS.saveForm}
      </button>
      <button onClick={clearForm} className="clear-button">
        {LABELS.clearForm}
      </button>
    </section>
  );
};

export default Dropzone;
