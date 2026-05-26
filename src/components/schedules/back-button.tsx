"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/dist/client/components/navigation";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition-colors"
      title="Back to schedules"
      onClick={() => router.back()}
    >
      <ChevronLeft size={20} />
    </button>
  );
};

export default BackButton;
