import FileExplorer from "@/components/file-explorer";
import { withRetry } from "@/utils/helper";
import { handleS3Error, storage } from "@/utils/storage";

export default async function Page({
  params,
}: {
  params: Promise<{ key: string[] }>;
}) {
  const { key } = await params;
  const children = await withRetry({
    func: handleS3Error(() => storage.listChildren(key.join("/"))),
  });

  return (
    <FileExplorer
      currentPath={key}
      files={children.files}
      subFolders={children.subFolders}
    />
  );
}
