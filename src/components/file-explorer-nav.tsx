import Link from "next/link";

const NavLink = (props: { path: string; name: string; isActive: boolean }) => (
  <div className="flex gap-4 whitespace-nowrap items-center">
    <Link
      data-is-active={props.isActive}
      className="[&:hover,&[data-is-active='true']]:underline underline-offset-2 [&:hover,&[data-is-active='true']]:text-sky-400 not-[&:hover,&[data-is-active='true']]:opacity-80"
      href={props.path === ".." ? "/" : `/files/${props.path}`}
    >
      {props.name}
    </Link>
    <p className="text-base">/</p>
  </div>
);

type Props = { folders: string[] };

const FileExplorerNavBar = (props: Props) => {
  return (
    <nav className="text-sm mb-4">
      <ul className="flex gap-4 items-center">
        <NavLink path=".." name="Home" isActive={props.folders.length === 0} />
        {props.folders.map((folder, index) => (
          <NavLink
            key={props.folders.slice(0, index + 1).join("/")}
            name={folder}
            path={props.folders.slice(0, index + 1).join("/")}
            isActive={props.folders.length === index + 1}
          />
        ))}
      </ul>
    </nav>
  );
};

export default FileExplorerNavBar;
