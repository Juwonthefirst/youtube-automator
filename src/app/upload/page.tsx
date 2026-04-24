"use client";

import { UploadControlsContext } from "@/components/file-upload-controller";
import FileUploadInput from "@/components/file-upload-input";
import Input from "@/components/input";
import { parseDateString } from "@/utils/helper";
import { LoaderCircle, UploadCloud } from "lucide-react";
import { use, useMemo, useState } from "react";

const FileInputField = ({ selectedFile }: { selectedFile: File | null }) => {
  const selectedFileUrl = useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ""),
    [selectedFile],
  );
  return (
    <div className="flex justify-center items-center w-full h-full bg-black/5 dark:bg-white/5 text-black dark:text-white text-sm p-4 border-dashed border-3 dark:border-white rounded-xl">
      {selectedFile ? (
        <video
          src={selectedFileUrl}
          className="w-9/10 h-9/10 object-cover"
          playsInline
          controls
        />
      ) : (
        <div className="flex flex-col gap-2 items-center justify-center">
          <UploadCloud className="size-12" />
          <p>Select or drop file here</p>
        </div>
      )}
    </div>
  );
};
const Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [noOfClips, setNoOfClips] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const uploadControls = use(UploadControlsContext);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!selectedFile) return setErrorMessage("Select a File to upload");
        setIsLoading(true);
        setErrorMessage("");
        const settings: Record<string, string> = {};
        if (filename) settings["filename"] = filename;
        if (noOfClips) settings["noOfClips"] = noOfClips;
        await uploadControls?.upload(selectedFile, settings);
        setSelectedFile(null);
        setFilename("");
        setNoOfClips("");
        setIsLoading(false);
      }}
      className="flex-col lg:flex-row flex gap-16"
    >
      <section className="flex flex-col gap-6 flex-1">
        <FileUploadInput
          className="max-w-xl w-full h-64 self-center"
          accept="video/*"
          maxFiles={1}
          onUpload={(files) => {
            if ((files && !files[0].type.startsWith("video/")) || !files)
              return;
            setSelectedFile(files[0]);
          }}
          labelChildren={<FileInputField selectedFile={selectedFile} />}
        />

        {selectedFile && (
          <section className="bg-black/10 dark:bg-white/10 rounded-xl p-4 max-w-xl w-full self-center">
            <h1 className="font-medium mb-2 text-lg">File information</h1>

            <ul className="text-sm list-inside list-disc space-y-1">
              <li>
                <b>Name:</b> {selectedFile.name}
              </li>
              <li>
                <b>Size: </b>
                {(selectedFile.size / (1024 * 1024)).toFixed(2) + "MB"}
              </li>
              <li>
                <b>Content type:</b> {selectedFile.type}
              </li>
              <li>
                <b>Last modidied:</b>{" "}
                {parseDateString({
                  dateString: new Date(selectedFile.lastModified).toISOString(),
                })}
              </li>
            </ul>
          </section>
        )}
      </section>
      <section className="flex-1 overflow-y-auto flex flex-col gap-4">
        <Input
          id="filename-input"
          value={filename}
          setValue={setFilename}
          label="File name"
          placeholder="Enter name to use as file name"
        />
        <Input
          id="clipnumber-input"
          type="number"
          label="Number of clips"
          value={noOfClips}
          setValue={setNoOfClips}
          placeholder="How many clips should created"
        />
        <p className="text-red-500 mt-auto text-sm text-center">
          {errorMessage}
        </p>
        <button
          disabled={isLoading}
          className=" flex justify-center items-center bg-black text-white dark:bg-white dark:text-black w-full p-2 text-lg font-medium rounded-lg disabled:opacity-80 active:scale-97 transition-all duration-100"
          type="submit"
        >
          {isLoading ? (
            <LoaderCircle className="animate-spin size-6" />
          ) : (
            "Upload"
          )}
        </button>
      </section>
    </form>
  );
};

export default Page;
