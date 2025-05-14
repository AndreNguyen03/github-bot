import clsx from "clsx";
interface BatchProps {
  color: string;
  content: string;
  onClick: () => void;
}
const colorMap: Record<string, string> = {
  red: "bg-red-200",
  green: "bg-green-200",
  blue: "bg-blue-200",
  yellow: "bg-yellow-200",
};
const textColormap: Record<string, string> = {
  red: "text-red-600",
  green: "text-green-600",
};



const TempBadge = ({ color, content, onClick }: BatchProps) => {
  return (
    <div className="flex">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        className={clsx(textColormap[color], "h-3.5 w-3.5")}
      >
        {color === "green" ? (
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        ) : (
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        )}
      </svg>

      <a
        onClick={() => {
          if (
            content.toLocaleLowerCase().includes("access") &&
            color === "green"
          )
            return;
          onClick();
        }}
        className={clsx(
          colorMap[color],
          !(
            content.toLocaleLowerCase().includes("access") && color === "green"
          ) && "hover:cursor-pointer hover:underline",
          "rounded-lg text-[10px] font-semibold text-blue-600",
        )}
      >
        {content}
      </a>
    </div>
  );
};

export default TempBadge;
