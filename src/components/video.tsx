"use client";

import { useMemo } from "react";

type Props = { file: File; className?: string; controls?: boolean };

const Video = (props: Props) => {
  const videoUrl = useMemo(() => URL.createObjectURL(props.file), [props.file]);
  return (
    <video
      src={videoUrl}
      playsInline
      className={props.className}
      controls={props.controls}
    />
  );
};

export default Video;
