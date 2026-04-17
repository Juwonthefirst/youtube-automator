"use client";

import { useEffect, useRef, useState } from "react";

export interface ConfirmationBtnProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  confirmationText: string;
}

const ConfirmationBtn = (props: ConfirmationBtnProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open && isDialogOpen) dialog.showModal();
    if (dialog.open && !isDialogOpen) dialog.close();
  }, [isDialogOpen]);
  return (
    <>
      <button
        className={props.className}
        type="button"
        onClick={() => setIsDialogOpen(true)}
      >
        {props.children}
      </button>
      {isDialogOpen && (
        <dialog
          ref={ref}
          data-state={isDialogOpen ? "open" : "closed"}
          className={
            "w-2xs border-black/20 dark:border-white/40 bg-white dark:bg-black dark:text-white fixed top-[50%] left-[50%] z-99 translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border px-6 py-4 shadow-lg"
          }
        >
          <p className="text-sm text-center whitespace-normal">
            {props.confirmationText}
          </p>
          <div className="flex gap-4 mt-6 *:rounded-md *:px-2 *:py-1 *:border-[1.5px] *:flex-1 font-medium">
            <button
              onClick={() => {
                setIsDialogOpen(false);
              }}
              type="button"
              className="bg-black dark:border-white/60 text-white"
            >
              Close
            </button>
            <button
              type="button"
              className="bg-white not-dark:border-black/60 text-black"
              onClick={() => {
                props.onClick();
                setIsDialogOpen(false);
              }}
            >
              Confirm
            </button>
          </div>
        </dialog>
      )}
    </>
  );
};

export default ConfirmationBtn;
