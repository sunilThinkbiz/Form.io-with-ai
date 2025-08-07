// src/utils/rules.ts
export const typedFormRules = {
  validationRules: {
    name: {
      validate: {
        required: true,
        minLength: 3,
        maxLength: 50,
        pattern: "^[a-zA-Z ]+$",
        customMessage: "Only letters and spaces allowed",
      },
    },
    email: {
      validate: {
        required: true,
        pattern: "^\\S+@\\S+\\.\\S+$",
        customMessage: "Invalid email format",
      },
    },
    phoneNumber: {
      validate: {
        required: true,
        pattern: "^[0-9]{10,15}$",
        customMessage: "Only digits allowed (10–15 chars)",
      },
    },
    password: {
      validate: {
        required: true,
        minLength: 8,
        customMessage: "Password must be at least 8 characters",
      },
    },
    position: {
      validate: {
        required: true,
        customMessage: "Position is required",
      },
    },
    department: {
      validate: {
        required: true,
        customMessage: "Department is required",
      },
    },
  },
  nestingRules: {
    disallowedNestings: [
      {
        required: true,
        parentType: "select", // Position is a dropdown
        parentKey: "position", // Match key of the Position field
        childType: "select", // Department is also a dropdown
        childKey: "department", // Match key of the Department field
      },
    ],
    maxNestingDepth: 2,
  },
};
