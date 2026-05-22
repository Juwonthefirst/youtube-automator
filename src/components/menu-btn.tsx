"use client";

import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { api } from "@/utils/api-client";
import MutationBtn from "./mutation-btn";
import { delay } from "@/utils/helper";
import { useRouter } from "next/navigation";

interface Props {
  Key: string;
}

const MenuBtn = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        type="button"
        className="-col-start-2 justify-self-end p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-all"
        onClick={(event) => {
          event.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <EllipsisVertical className="size-5" />
      </button>
      {isOpen && (
        <dialog
          open
          className="absolute -left-10 text-sm whitespace-nowrap flex flex-col gap-1 z-10 bg-white dark:text-white dark:bg-black border-black/20 dark:border-white/20 border-[1.5px] rounded-xl p-1.5 shadow-lg "
        >
          <MutationBtn
            mutationFn={async () => {
              await api.delete<void>("/api/storage/files/" + props.Key);
              router.refresh();
            }}
            className="text-red-400  hover:bg-red-500/40 rounded-md px-2 py-1"
            confirmationText="Are you sure you want to delete this file"
          >
            Delete
          </MutationBtn>
          <MutationBtn
            className="hover:bg-black/15 dark:hover:bg-white/15 rounded-md px-2 py-1"
            mutationFn={async () => {
              await delay(3000);
              alert("juwon");
            }}
            confirmationText={`You are uploading ${props.Key} to YouTube`}
          >
            Upload
          </MutationBtn>
        </dialog>
      )}
    </div>
  );
};

export default MenuBtn;
