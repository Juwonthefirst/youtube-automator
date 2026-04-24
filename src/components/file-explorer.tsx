import FileCard from "./file-card";
import FolderCard from "./folder-card";
import FileExplorerNavBar from "./file-explorer-nav";
import { StorageFileInfo, StorageFolderInfo } from "@/utils/types";

interface Props {
  files: StorageFileInfo[];
  subFolders: StorageFolderInfo[];
  currentPath: string[];
}
const FileExplorer = (props: Props) => {
  return (
    <>
      <FileExplorerNavBar folders={props.currentPath} />
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {props.subFolders.map((subFolder) => (
          <FolderCard {...subFolder} key={subFolder.Key} />
        ))}
        {props.files.map((file) => (
          <FileCard {...file} key={file.Key} />
        ))}
      </section>
    </>
  );
};

export default FileExplorer;
