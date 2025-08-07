import { typedFormRules } from "./rules";
import { toast } from "react-toastify";

type RuleKey = keyof typeof typedFormRules.validationRules;

function isRuleKey(key: string): key is RuleKey {
  return key in typedFormRules.validationRules;
}

function getActualRuleKey(key: string): RuleKey | null {
  const matched = Object.keys(typedFormRules.validationRules).find(
    (ruleKey) => ruleKey.toLowerCase() === key.toLowerCase()
  );
  return matched && isRuleKey(matched) ? matched : null;
}

function applyValidationRules(component: any): any {
  const key = component.key?.toLowerCase();
  const matchedKey = key ? getActualRuleKey(key) : null;

  if (matchedKey) {
    const rule = typedFormRules.validationRules[matchedKey];
    return {
      ...component,
      validate: {
        ...(component.validate || {}),
        ...rule.validate,
      },
    };
  }
  return component;
}

function applyValidationRulesRecursively(component: any): any {
  const updatedComponent = applyValidationRules(component);

  if (updatedComponent.components) {
    updatedComponent.components = updatedComponent.components.map(
      applyValidationRulesRecursively
    );
  }

  if (updatedComponent.columns) {
    updatedComponent.columns = updatedComponent.columns.map((col: any) => ({
      ...col,
      components: col.components.map(applyValidationRulesRecursively),
    }));
  }

  return updatedComponent;
}

function checkDisallowedNesting(parent: any, child: any): boolean {
  return typedFormRules.nestingRules.disallowedNestings.some((rule) => {
    return (
      (!rule.parentType ||
        rule.parentType.toLowerCase() === (parent.type || "").toLowerCase()) &&
      (!rule.parentKey ||
        rule.parentKey.toLowerCase() === (parent.key || "").toLowerCase()) &&
      (!rule.childType ||
        rule.childType.toLowerCase() === (child.type || "").toLowerCase()) &&
      (!rule.childKey ||
        rule.childKey.toLowerCase() === (child.key || "").toLowerCase())
    );
  });
}

function validateNesting(
  component: any,
  errors: string[],
  parent: any = null,
  level = 1
): boolean {
  const maxNestingDepth = typedFormRules.nestingRules.maxNestingDepth;
  let isValid = true;

  if (level > maxNestingDepth) {
    errors.push(`❌ Nesting exceeds allowed depth of ${maxNestingDepth}`);
    isValid = false;
  }

  if (parent && checkDisallowedNesting(parent, component)) {
    errors.push(
      `❌ Invalid nesting: '${component.key}' (type: ${component.type}) inside '${parent.key}' (type: ${parent.type})`
    );
    isValid = false;
  }

  const children: any[] = [];
  if (Array.isArray(component.components))
    children.push(...component.components);
  if (Array.isArray(component.columns)) {
    component.columns.forEach((col: any) => {
      if (Array.isArray(col.components)) {
        children.push(...col.components);
      }
    });
  }

  for (const child of children) {
    if (!validateNesting(child, errors, component, level + 1)) {
      isValid = false;
    }
  }

  return isValid;
}

function enforceRulesOnComponents(
  components: any[],
  setError: (msg: string) => void
): any[] {
  const errors: string[] = [];

  const validated = components
    .filter((comp) => validateNesting(comp, errors))
    .map((comp) => applyValidationRulesRecursively(comp));

  if (errors.length > 0) {
    setError(errors.join("\n")); // You can also toast.error here if you prefer
  }

  return validated;
}

export {
  typedFormRules,
  applyValidationRules,
  applyValidationRulesRecursively,
  validateNesting,
  enforceRulesOnComponents,
};
