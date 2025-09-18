import classNames from "classnames";

function DropdownItem({
  label,
  icon,
  isOn,
  onToggle,
}: {
  label: string;
  icon: React.ReactNode;
  isOn: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition">
      <div className="flex items-center gap-2">
        {icon}
        <span className={classNames("text-sm", {
        'text-black' :  isOn,
        "text-gray-400" : !isOn ,
        })}>{label}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`w-5 h-3.5 flex items-center rounded-full p-0.5 transition ${
          isOn ? "bg-black" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-2.5 h-2.5 bg-white rounded-full shadow transform transition ${
            isOn ? "translate-x-[6px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default DropdownItem;
