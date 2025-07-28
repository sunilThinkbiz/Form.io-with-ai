import React, { useState } from "react";
import { Form } from "@formio/react";
import GeminiFormGenerator from "./GeminiFormGenerator";
import axios from "axios";

type ComponentType = {
  type: string;
  key: string;
  label: string;
  placeholder?: string;
  value?: string;
  input: boolean;
  validate?: { required: boolean };
  [key: string]: any;
};

const componentPalette: Array<Partial<ComponentType>> = [
  { type: "textfield", label: "Text Field", placeholder: "Enter text" },
  { type: "textarea", label: "Text Area", placeholder: "Enter long text" },
  { type: "number", label: "Number", placeholder: "Enter number" },
  { type: "email", label: "Email", placeholder: "Enter email" },
  { type: "password", label: "Password", placeholder: "Enter password" },
  { type: "phoneNumber", label: "Phone Number", placeholder: "Enter phone" },
  { type: "checkbox", label: "Checkbox" },
  {
    type: "radio",
    label: "Radio",
    values: [{ label: "Option 1", value: "1" }],
  },
  {
    type: "select",
    label: "Select",
    data: {
      values: [
        { label: "Option A", value: "a" },
        { label: "Option B", value: "b" },
      ],
    },
    dataSrc: "values",
  },
  { type: "button", label: "Submit", action: "submit" },
  { type: "datetime", label: "Date Time" },
  { type: "content", label: "Content", html: "<p>Static Content</p>" },
  { type: "html", label: "HTML Element", tag: "p", content: "Hello" },
  { type: "panel", label: "Panel", title: "Panel" },
  {
    type: "columns",
    label: "Columns",
    columns: [{ components: [] }, { components: [] }],
  },
  { type: "fieldset", label: "Field Set", legend: "Info", components: [] },
];

const FormBuilder: React.FC = () => {
  const [components, setComponents] = useState<ComponentType[]>([]);

  const handleDragStart = (component: any, e: React.DragEvent) => {
    e.dataTransfer.setData("component", JSON.stringify(component));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("component");
    const draggedComponent = JSON.parse(data);

    const newComponent: ComponentType = {
      type: draggedComponent.type,
      key: `${draggedComponent.type}_${Date.now()}`,
      label: draggedComponent.label,
      placeholder: draggedComponent.placeholder || "",
      value: "",
      input: true,
      validate: { required: false },
    };

    setComponents((prev) => [...prev, newComponent]);
  };

 const addGeneratedComponents = (newFields: ComponentType[]) => {
  setComponents((prevComponents) => {
    const updated = [...prevComponents];

    newFields.forEach((newField) => {
      const existingIndex = updated.findIndex((c) => c.key === newField.key);
      if (existingIndex !== -1) {
        // ✅ Update the existing field
        updated[existingIndex] = { ...updated[existingIndex], ...newField };
      } else {
        // ✅ Add only if it's new
        updated.push(newField);
      }
    });

    return updated;
  });
};


  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const saveFormSchema = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/forms/save",
        formSchema
      );
      alert("Form schema saved successfully!");
      console.log("Saved:", response.data);
    } catch (error) {
      console.error("Error saving schema:", error);
      alert("Failed to save form schema");
    }
  };

  const formSchema = {
    display: "form" as const,
    components,
  };

  return (
    <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
      {/* Left Sidebar - Fields Palette */}
      <div style={{ width: "200px", borderRight: "1px solid #ccc" }}>
        <h3>Fields</h3>
        {componentPalette.map((item, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(item, e)}
            style={{
              border: "1px solid #999",
              padding: "8px",
              margin: "6px 0",
              cursor: "grab",
              background: "#f0f0f0",
            }}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Center Panel - Drop Area and AI Generator */}
      <div style={{ display: "flex", flex: 1, gap: "20px" }}>
        {/* Left: Drop Area */}
        <div
          style={{
            flex: 1,
            minHeight: "400px",
            border: "2px dashed #aaa",
            padding: "20px",
            borderRadius: "6px",
            background: "#fafafa",
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <h3>Drop Here to Build Form</h3>
          {components.length === 0 ? (
            <p>Drag fields from the left to build your form.</p>
          ) : (
           <Form
                form={{
                  display: "form",
                  components,
                }}
                onSubmit={() => { } } src={""}    />
          )}
          <div>
            <button
              onClick={saveFormSchema}
              style={{
                marginTop: "10px",
                padding: "10px 20px",
                background: "#4CAF50",
                color: "#fff",
                cursor:"pointer"
              }}
            >
              Save Form Schema
            </button>
          </div>
        </div>

        {/* Right: AI Prompt Generator */}
        <div
          style={{
            flex: 1,
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "6px",
          }}
        >
          <h3>Generate Form via AI Prompt</h3>
          <GeminiFormGenerator
            addGeneratedComponents={addGeneratedComponents}
            existingComponents={components}
          />
        </div>
      </div>

      {/* Preview Panel */}
      <div style={{ width: "400px" }}>
        <h3>Live Preview</h3>
        <Form
          form={formSchema}
          options={{}}
          onSubmit={(submission) => {
            console.log("Form Submitted:", submission);
            alert("Form submitted! Check console.");
          }}
          src={""}
        />
        <h4>Generated Schema</h4>
        <pre
          style={{
            maxHeight: "200px",
            overflow: "auto",
            background: "#f9f9f9",
          }}
        >
          {JSON.stringify(formSchema, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FormBuilder;
