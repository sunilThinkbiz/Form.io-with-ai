export const componentPalette = [
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
    label: "Department",
    key: "department",
    data: {
      values: [
        { label: "Engineering", value: "engineering" },
        { label: "HR", value: "hr" },
      ],
    },
    dataSrc: "values",
  },
  {
    type: "select",
    label: "Position",
    key: "position",
    data: {
      values: [
        { label: "Developer", value: "developer" },
        { label: "HR", value: "hr" },
      ],
    },
    dataSrc: "values",
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
  { type: "button", label: "button", action: "submit" },
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