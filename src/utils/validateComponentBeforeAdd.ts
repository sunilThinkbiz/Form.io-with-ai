export const validateComponentBeforeAdd = async (
  component: any,
  FormFields: any[]
): Promise<boolean> => {
  const keys = FormFields.map((v) => (v.key || v.type).toLowerCase());
  const type = (component.type || "").toLowerCase();
  const key = (component.key || "").toLowerCase();

  const isValid = keys.includes(type) || keys.includes(key);

  if (!isValid) {
    const shouldAdd = window.confirm(
      `🚨 The field '${component.label || component.key}' is not part of the allowed schema.\n\nDo you want to add it anyway?`
    );
    return shouldAdd;
  }

  return true;
};
