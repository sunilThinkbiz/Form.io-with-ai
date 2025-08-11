type DisallowedNestingRule = {
  parent: string;
  child: string;
};

type ValidationRule = {
  validate: {
    required: boolean;
    minLength?: number;
    pattern?: RegExp;
  };
};

export type FormRulesType = {
  maxNestingDepth: number;
  disallowedNesting: readonly DisallowedNestingRule[];
};

export type ComponentType = {
  type: string;
  key: string;
  label: string;
  placeholder?: string;
  value?: string;
  input: boolean;
  validate?: {
    required?: boolean;
    pattern?: string | RegExp;
    minLength?: number;
  };

  components?: ComponentType[]; // Include nested components
  [key: string]: any;
};

