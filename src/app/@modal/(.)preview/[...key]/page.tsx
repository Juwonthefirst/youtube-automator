import FilePreviewModal from "@/components/file-preview-modal";
import { storage } from "@/utils/aws/storage";

export default async function PreviewModalPage({
  params,
}: {
  params: Promise<{ key: string[] }>;
}) {
  const { key } = await params;

  if (key.length < 1) {
    return null;
  }

  const fileName = key[key.length - 1];
  const filePath = key.slice(0, -1);
  const fileURL = await storage.getFileUrl(key.join("/"));
  return (
    <FilePreviewModal
      name={fileName}
      fileURL={fileURL}
      currentPath={filePath}
    />
  );
}
