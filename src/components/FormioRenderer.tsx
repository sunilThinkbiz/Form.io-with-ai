import React, { DragEvent, useMemo } from "react";
import { Form } from "@formio/react";
import { toast } from "react-toastify";

import { useFormBuilder } from "../hook/useFormBuilder";
import { componentPalette } from "../common/Field";
import GeminiFormGenerator from "./GeminiFormGenerator";
import { ComponentType } from "../types";
import "../assets/styles/FormBuilder.css";

const FormBuilder: React.FC = () => {
  const {
    components,
    clearForm,
    handleSaveForm,
    addComponent,
    addGeneratedFields,
  } = useFormBuilder();

  const handleDragStart = (component: ComponentType, e: DragEvent) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("component");
    const dragged = JSON.parse(data);

    const newComponent: ComponentType = {
      type: dragged.type,
      key: `${dragged.type}_${Date.now()}`,
      label: dragged.label,
      placeholder: dragged.placeholder || "",
      value: "",
      input: true,
      validate: { required: false },
    };

    addComponent(newComponent);
  };

  const handleDragOver = (e: DragEvent) => e.preventDefault();

  const formSchema = useMemo(
    () => ({
      display: "form" as const,
      components,
    }),
    [components]
  );

  return (
    <div className="form-builder-container">
      <aside className="form-builder-sidebar">
        <h3>Fields</h3>
        {componentPalette.map((item: any, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(item, e)}
            className="form-builder-draggable"
          >
            {item.label}
          </div>
        ))}
      </aside>

      <main className="form-builder-main">
        <section
          className="form-builder-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h3>Form Builder</h3>
          {components.length === 0 ? (
            <p>Drag fields to build your form.</p>
          ) : (
            <Form form={formSchema} onSubmit={() => {}} src="" />
          )}
          <button onClick={handleSaveForm} className="save-form-button">
            Save Form
          </button>

          <button onClick={clearForm} className="clear-button">
            Clear Form
          </button>
        </section>

        <section className="form-builder-ai-section">
          <h3>AI Field Generator</h3>
          <GeminiFormGenerator
            addGeneratedComponents={addGeneratedFields}
            existingComponents={components}
            FormFeilds={componentPalette}
          />
        </section>
      </main>

      <aside className="form-builder-preview">
        <h3>Live Preview</h3>
        <Form
          form={formSchema}
          onSubmit={(submission) => {
            toast.success("Form submitted!");
            console.log("Submitted:", submission);
          }}
          onSubmitError={(errors) => {
            toast.error("Fix the errors before submitting.");
            console.error(errors);
          }}
          src=""
        />

        <h4>Form JSON</h4>
        <pre className="form-builder-json">
          {JSON.stringify(formSchema, null, 2)}
        </pre>
      </aside>
    </div>
  );
};

export default FormBuilder;
