import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import ConfirmationBtn, { ConfirmationBtnProps } from "./confirmation-btn";
import { withRetry } from "@/utils/helper";

interface MutationBtnProps<ResponseType> extends Omit<
  ConfirmationBtnProps,
  "onClick"
> {
  mutationFn: () => Promise<ResponseType>;
  onSuccess?: (data: ResponseType) => void;
  onClick?: () => void;
}

export default function MutationBtn<Type>(props: MutationBtnProps<Type>) {
  const [mutationState, setMutationState] = useState<
    "idle" | "loading" | "error" | "success"
  >("idle");

  return (
    <ConfirmationBtn
      className={props.className}
      confirmationText={props.confirmationText}
      onClick={() => {
        setMutationState("loading");
        props.onClick?.();
        (async () => {
          try {
            const response = await withRetry({ func: props.mutationFn });
            props.onSuccess?.(response);
            setMutationState("success");
          } catch {
            setMutationState("error");
          }
        })();
      }}
    >
      {mutationState === "loading" ? (
        <LoaderCircle className="animate-spin size-4" />
      ) : (
        props.children
      )}
    </ConfirmationBtn>
  );
}
