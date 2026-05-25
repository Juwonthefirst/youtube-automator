import FilePreviewModal from "@/components/file-preview-modal";
import { storage } from "@/utils/storage";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ key: string[] }>;
}) {
  const { key } = await params;

  if (key.length < 1) {
    return <div>Invalid file key</div>;
  }

  const fileName = key[key.length - 1];
  const filePath = key.slice(0, -1);
  const fileURL = await storage.getFileUrl(key.join("/"));
  return (
    <div className="min-h-screen flex items-center justify-center">
      <FilePreviewModal
        name={fileName}
        fileURL={fileURL}
        currentPath={filePath}
      />
    </div>
  );
}
