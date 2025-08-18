import { Form } from "@formio/react";
import React from "react";
import { toast } from "react-toastify";
import { ComponentType } from "../types";
import { LIVEPRVIEW } from "../AppConstant";

interface LivePreviewProps {
  formSchema: { display: "form"; components: ComponentType[] };
}

const LivePreview: React.FC<LivePreviewProps> = ({ formSchema }) => {
  return (
    <div>
      <h3>{LIVEPRVIEW.HEADINGLIVEPREVIEW}</h3>
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

      <h4>{LIVEPRVIEW.FORMJSON}</h4>
      <pre className="form-builder-json">
        {JSON.stringify(formSchema, null, 2)}
      </pre>
    </div>
  );
};

export default LivePreview;
