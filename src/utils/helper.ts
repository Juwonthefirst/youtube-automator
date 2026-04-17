export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface WithRetry<Type> {
  func: () => Promise<Type>;
  maxRetryCount?: number;
}

export const withRetry = async <Type>({
  func,
  maxRetryCount = 3,
}: WithRetry<Type>): Promise<Type> => {
  let retryCount = 0;
  let retryTimeout = 1 * 1000;

  while (true) {
    try {
      return await func();
    } catch (error) {
      retryCount++;
      if (retryCount > maxRetryCount) {
        throw error;
      }
    }
    await delay(Math.min(retryTimeout, 10 * 1000));
    retryTimeout *= 2;
  }
};

// export const asyncXMLRequest = (
//   url: string,
//   data: Document,
//   onUploadProgress: (event: ProgressEvent) => void,
// ) =>
//   new Promise((resolve, reject) => {
//     const xml = new XMLHttpRequest();
//     xml.open("PUT", url, true);
//     xml.upload.onprogress = onUploadProgress;
//     xml.onerror = () => reject("Request failed");
//     xml.send(data);
//   });

interface ParseDateStringParam {
  dateString: string;
  fullDate?: boolean;
  timeOnly?: boolean;
}

export const parseDateString = ({
  dateString,
  fullDate = false,
  timeOnly = false,
}: ParseDateStringParam) => {
  if (!dateString) return dateString;

  const currentDate = new Date();
  const date = new Date(dateString);
  const yesterdayDate = new Date(dateString);
  yesterdayDate.setDate(yesterdayDate.getDate() + 1);

  const timeStyleOption: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const currentTime = date.toLocaleTimeString("en-US", timeStyleOption);

  if (
    currentDate.toLocaleDateString() === date.toLocaleDateString() ||
    timeOnly
  )
    return currentTime;
  else if (
    currentDate.toLocaleDateString() === yesterdayDate.toLocaleDateString()
  )
    return fullDate ? `Yesterday, ${currentTime}` : "Yesterday";
  else
    return fullDate
      ? date.toLocaleString("en-GB", {
          ...timeStyleOption,
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : date.toLocaleDateString("en-GB");
};
