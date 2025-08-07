// defaultValues.ts

export const defaultValues = [
  {
    type: "textfield",
    key: "name",
    label: { en: "Name", jp: "氏名" },
    defaultValue: "Sunil Pawar",
    input: true,
    aliases: ["name", "氏名"]
  },
  {
    type: "email",
    key: "email",
    label: { en: "Email", jp: "メール" },
    defaultValue: "sunil@example.com",
    input: true,
    aliases: ["email", "メール"]
  },
  {
    type: "select",
    key: "gender",
    label: { en: "Gender", jp: "性別" },
    defaultValue: "Male",
    data: {
      values: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" }
      ]
    },
    dataSrc: "values",
    input: true,
    aliases: ["gender", "性別"]
  },
  {
    type: "select",
    key: "country",
    label: { en: "Country", jp: "国" },
    defaultValue: "India",
    data: {
      values: [
        { label: "India", value: "India" },
        { label: "USA", value: "USA" },
        { label: "Japan", value: "Japan" },
        { label: "Germany", value: "Germany" },
        { label: "Australia", value: "Australia" }
      ]
    },
    dataSrc: "values",
    input: true,
    aliases: ["country", "国"]
  },
  {
    type: "radio",
    key: "feedback",
    label: { en: "Did you find this useful?", jp: "これは役に立ちましたか？" },
    defaultValue: "yes",
    values: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" }
    ],
    input: true,
    inline: true,
    aliases: ["feedback", "radio", "ラジオボタン"]
  },
  {
    type: "checkbox",
    key: "newsletter",
    label: { en: "Subscribe to newsletter", jp: "ニュースレターを購読する" },
    defaultValue: false,
    input: true,
    aliases: ["newsletter", "checkbox", "チェックボックス"]
  }
];
