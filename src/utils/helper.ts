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

export const asyncXMLRequest = (
  url: string,
  data: Document,
  onUploadProgress: (event: ProgressEvent) => void,
) =>
  new Promise((resolve, reject) => {
    const xml = new XMLHttpRequest();
    xml.open("PUT", url, true);
    xml.upload.onprogress = onUploadProgress;
    xml.onerror = () => reject("Request failed");
    xml.send(data);
  });
