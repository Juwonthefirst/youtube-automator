type Props = { percent: string; className?: string };

const ProgressBar = (props: Props) => {
  return (
    <div
      className={`bg-black/15 dark:bg-white/30 rounded-full h-2.5 w-full /animate-pulse ${props.className || ""}`}
    >
      <div
        className="h-full bg-sky-400 rounded-full"
        style={{ width: props.percent + "%" }}
      />
    </div>
  );
};

export default ProgressBar;
