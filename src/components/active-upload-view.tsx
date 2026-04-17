"use client";

import { use } from "react";
import { ActiveUploadsContext } from "./file-upload-controller";
import ActiveUploadCard from "./active-upload-card";

const ActiveUploadView = () => {
  const activeUploads = use(ActiveUploadsContext);

  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-6">
      {activeUploads.map((activeUpload) => (
        <ActiveUploadCard {...activeUpload} key={activeUpload.uploadId} />
      ))}
    </section>
  );
};

export default ActiveUploadView;
