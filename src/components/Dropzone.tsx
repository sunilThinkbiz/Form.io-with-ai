import { Form } from "@formio/react";
import React from "react";
import { ComponentType } from "../types";
import { LABELS } from "../AppConstant";

interface DropzoneProps {
  components: ComponentType[];
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
}) => {
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
        <Form form={formSchema} onSubmit={() => {}} src="" />
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
