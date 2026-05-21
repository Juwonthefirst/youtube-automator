"use client";

import { Video } from "lucide-react";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const Thumbnail = (props: ImageProps) => {
  const [isFailed, setIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  return isFailed || isLoading ? (
    <Video size={32} className="shrink-0" />
  ) : (
    <Image
      {...props}
      alt={props.alt || "Thumbnail"}
      onError={() => setIsFailed(true)}
      onLoad={() => setIsLoading(true)}
    />
  );
};

export default Thumbnail;
