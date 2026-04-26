"use client";

import AddClipForm from "@/components/clip/add-clip-form";
import Clip from "@/components/clip/clip";
import FileInputField from "@/components/file-input-field";
import { UploadControlsContext } from "@/components/file-upload-controller";
import FileUploadInput from "@/components/file-upload-input";
import Input from "@/components/input";
import { UploadMetadata } from "@/utils/types";
import { Film, LoaderCircle } from "lucide-react";
import { use, useState } from "react";

const Page = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<UploadMetadata>({
    clipName: "",
    clips: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showClipForm, setShowClipForm] = useState(false);
  const uploadControls = use(UploadControlsContext);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!selectedFile) return setErrorMessage("Select a File to upload");
        setIsLoading(true);
        setErrorMessage("");
        if (!metadata.clipName)
          return setErrorMessage("Enter Clip project name");
        await uploadControls?.upload(selectedFile, metadata);
        setSelectedFile(null);
        setIsLoading(false);
      }}
      className="flex-col flex gap-8 p-4"
    >
      <Input
        id="clipName-input"
        value={metadata.clipName}
        setValue={(value) => setMetadata({ ...metadata, clipName: value })}
        label="Clip project name"
        placeholder="Enter name to use as file name"
      />
      <section className="">
        <h2 className="text-lg font-medium mb-3">Select video to clip</h2>
        <FileUploadInput
          className="lg:w-xl w-full h-64 self-center"
          accept="video/*"
          maxFiles={1}
          onUpload={(files) => {
            if ((files && !files[0].type.startsWith("video/")) || !files)
              return;
            setSelectedFile(files[0]);
            setMetadata({ ...metadata, clips: [] });
          }}
          labelChildren={<FileInputField selectedFile={selectedFile} />}
        />
      </section>
      {selectedFile && (
        <section className="mt-3 flex flex-col gap-4">
          <h2 className="text-lg font-medium">Clips</h2>
          <ul className="space-y-4">
            {metadata.clips.map((clip) => (
              <li key={clip.uuid}>
                <Clip
                  {...clip}
                  onRemove={() =>
                    setMetadata({
                      ...metadata,
                      clips: metadata.clips.filter(
                        (metadataClip) => clip.uuid !== metadataClip.uuid,
                      ),
                    })
                  }
                />
              </li>
            ))}
          </ul>
          {showClipForm && (
            <AddClipForm
              setClips={(clip) =>
                setMetadata({ ...metadata, clips: [...metadata.clips, clip] })
              }
              closeForm={() => setShowClipForm(false)}
            />
          )}
          <button
            type="button"
            onClick={() => setShowClipForm(!showClipForm)}
            className="flex gap-2 bg-black text-white dark:text-black items-center dark:bg-white font-medium text-sm rounded-md py-1.5 px-3 hover:ring-4 ring-black/10 dark:ring-white/20 w-fit"
          >
            <Film size={18} /> {showClipForm ? "Cancel" : "Add clip"}
          </button>
        </section>
      )}
      {/* <Input
          id="clipnumber-input"
          type="number"
          label="Number of clips"
          value={noOfClips}
          setValue={setNoOfClips}
          placeholder="How many clips should created"
        /> */}
      <p className="text-red-500 mt-auto text-sm text-center">{errorMessage}</p>
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
    </form>
  );
};

export default Page;
