import FileExplorer from "@/components/file-explorer";
import { withRetry } from "@/utils/helper";
import { handleS3Error, storage } from "@/utils/storage";

export const dynamic = "force-dynamic";
export default async function Home() {
  const children = await withRetry({
    func: handleS3Error(() => storage.listChildren()),
  });

  return (
    <FileExplorer
      currentPath={[]}
      files={children.files}
      subFolders={children.subFolders}
    />
  );
}
