"use client";

import { ReactNode, useRef, useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const InfoPopup = ({ open, onClose, children }: Props) => {
  const ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open && open) dialog.showModal();
    if (dialog.open && !open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className={
        "w-2xs border-black/20 dark:border-white/40 bg-white dark:bg-black dark:text-white fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border px-6 py-4 shadow-lg"
      }
    >
      {children}
      <div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 rounded-md bg-black px-2 py-1 font-medium text-white dark:bg-white dark:text-black w-full"
        >
          Close
        </button>
      </div>
    </dialog>
  );
};

export default InfoPopup;
