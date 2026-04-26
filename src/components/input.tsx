interface Props {
  value: string;
  type?: string;
  placeholder: string;
  setValue: (value: string) => void;
  label: string;
  id: string;
  className?: string;
}

const Input = (props: Props) => {
  return (
    <div
      className={`flex flex-col gap-2 items-center text-black dark:text-white ${props.className || ""}`}
    >
      <label htmlFor={props.id} className="font-medium self-start">
        {props.label}
      </label>
      <input
        type={props.type}
        className="text-sm focus:outline-0 w-full border-black/40 dark:border-white/40 border-[1.5px] rounded-lg p-2 [&:hover,&:focus]:border-black/80 dark:[&:hover,&:focus]:border-white/80 transition-all placeholder:italic"
        id={props.id}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(event) => props.setValue(event.target.value)}
      />
    </div>
  );
};

export default Input;
