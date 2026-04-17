"use client";

import { Redo } from "lucide-react";
import { UploadControlsContext } from "./file-upload-controller";
import { use } from "react";

interface Props {
  errorMessage: string;
  UploadId: string;
}

const UploadControl = (props: Props) => {
  const uploadControls = use(UploadControlsContext);
  return (
    <>
      {props.errorMessage && (
        <div className="text-red-500 flex gap-2">
          <p>{props.errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              uploadControls?.continueUpload(props.UploadId);
            }}
          >
            Retry <Redo size={18} />
          </button>
        </div>
      )}
    </>
  );
};

export default UploadControl;
