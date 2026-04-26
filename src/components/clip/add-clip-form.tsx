"use client";

import { Clip } from "@/utils/types";
import { useState } from "react";
import Input from "../input";
import Button from "../button";
import { v4 as uuidv4 } from "uuid";

interface Props {
  setClips: (clip: Clip) => void;
  closeForm: () => void;
}

const AddClipForm = (props: Props) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <section className="grid grid-cols-2 gap-3 w-64 *:text-sm">
      <Input
        className="col-span-2"
        id="clip-title-input"
        value={title}
        setValue={setTitle}
        label="Title"
        placeholder="Enter clip title here"
      />
      <Input
        id="clip-start-time-input"
        value={startTime}
        setValue={setStartTime}
        label="Start time"
        placeholder="Enter start time eg 52:43"
      />
      <Input
        id="clip-end-time-input"
        value={endTime}
        setValue={setEndTime}
        label="End time"
        placeholder="Enter start time eg 52:43"
      />
      <p className="text-red-500 text-xs! text-center col-span-2">
        {errorMessage}
      </p>

      <Button
        onClick={() => {
          if (!title) return setErrorMessage("Enter clip title");
          if (!startTime) return setErrorMessage("Enter clip start time");
          if (!endTime) return setErrorMessage("Enter clip end time");

          props.setClips({
            title,
            start: startTime,
            end: endTime,
            uuid: uuidv4(),
          });
          props.closeForm();
        }}
        className="col-span-2"
        type="button"
      >
        Create Clip
      </Button>
    </section>
  );
};

export default AddClipForm;
