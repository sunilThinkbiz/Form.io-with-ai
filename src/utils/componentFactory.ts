// utils/componentFactory.ts
import { ComponentType } from "../types";
import { AUTO_GENERATE_FIELD } from "../AppConstant";
/**
 * Create an AutoGenerateContainer with correct styles + unique key
 * and wire the button to a custom Form.io "event" called "generateDescription".
 */
export function createAutoGenerateContainer(
  base: ComponentType
): ComponentType {
  const {
    containerClass,
    AUTO_FIELD_KEY,
    autogenerateTextArea,
    GENERATE_BUTTON_KEY,
    buttonStyle,
  } = AUTO_GENERATE_FIELD;
  const newComponent: ComponentType = {
    ...base,
    key: `autoGenerate_${Date.now()}`,
    customClass: containerClass,
    columns: (base.columns || []).map((col: any) => ({
      ...col,
      components: (col.components || []).map((comp: any) => {
        if (comp.key === AUTO_FIELD_KEY) {
          return { ...comp, customClass: autogenerateTextArea };
        }
        if (comp.key === GENERATE_BUTTON_KEY) {
          return {
            ...comp,
            type: "button",
            action: "event",
            event: "generateDescription", // <- IMPORTANT: event name
            customClass: buttonStyle,
            disableOnInvalid: false, // let it click even if form invalid
          };
        }
        return comp;
      }),
    })),
  };

  return newComponent;
}
