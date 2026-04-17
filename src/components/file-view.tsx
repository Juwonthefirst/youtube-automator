import { withRetry } from "@/utils/helper";
import { StorageFileInfo } from "@/utils/types";
import FileCard from "./file-card";
import { api } from "@/utils/api-client";

const FileView = async () => {
  // const fileInfo = await withRetry({
  //   func: () =>
  //     api
  //       .get<{ files: StorageFileInfo[] }>("/api/storage")
  //       .then((res) => res.data),
  // });

  const fileInfos: { files: StorageFileInfo[] } = {
    files: [
      {
        name: "test.mp4",
        size: 200 * 1024 * 1024,
        isFolder: false,
        Key: "test.mp4",
        created_at: new Date().toISOString(),
      },
      {
        name: "bondoocks",
        size: 200 * 1024 * 1024,
        isFolder: true,
        Key: "bondocks",
        created_at: new Date().toISOString(),
      },
      {
        name: "Invincible",
        size: 200 * 1024 * 1024,
        isFolder: true,
        Key: "Invincible",
        created_at: new Date().toISOString(),
      },
      {
        name: "test1.mp4",
        size: 200 * 1024 * 1024,
        isFolder: false,
        Key: "test1.mp4",
        created_at: new Date().toISOString(),
      },
    ],
  };
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-6">
      {fileInfos.files.map((fileInfo) => (
        <FileCard {...fileInfo} key={fileInfo.Key} />
      ))}
    </section>
  );
};

export default FileView;
