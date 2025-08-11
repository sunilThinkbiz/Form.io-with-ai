import React, { DragEvent, useMemo } from "react";
import { useFormBuilder } from "../hook/useFormBuilder";
import { componentPalette } from "../common/Field";
import GeminiFormGenerator from "./GeminiFormGenerator";
import { ComponentType } from "../types";
import "../assets/styles/FormBuilder.css";
import Sidebar from "./Sidebar";
import Dropzone from "./Dropzone";
import LivePreview from "./LivePreview";
import { HEADERS } from "../AppConstant";

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
        <Sidebar
          handleDragStart={handleDragStart}
          componentPalette={componentPalette}
        />
      </aside>

      <main className="form-builder-main">
        <Dropzone
          components={components}
          handleDrop={handleDrop}
          handleDragOver={handleDragOver}
          formSchema={formSchema}
          handleSaveForm={handleSaveForm}
          clearForm={clearForm}
        />

        <section className="form-builder-ai-section">
          <h3>{HEADERS.askfieldGenerator}</h3>
          <GeminiFormGenerator
            addGeneratedComponents={addGeneratedFields}
            existingComponents={components}
            FormFeilds={componentPalette}
          />
        </section>
      </main>

      <aside className="form-builder-preview">
        <LivePreview formSchema={formSchema} />
      </aside>
    </div>
  );
};

export default FormBuilder;
