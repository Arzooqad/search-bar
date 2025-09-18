import { motion } from "framer-motion";
import { FiCheck, FiUser } from "react-icons/fi";
import { ImLink } from "react-icons/im";
import { FaFolder, FaImage, FaPlay } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import type { SearchResult } from "../types";
import { highlight } from "../utils/utils";
import classNames from "classnames";
import { RxExternalLink } from "react-icons/rx";

interface ResultItemProps {
  item: SearchResult;
  search: string;
  index: number;
  copied: boolean;
  onCopy: (link: string | undefined) => void;
  isLast: boolean;
}

const ResultItem: React.FC<ResultItemProps> = ({
  item,
  search,
  index,
  copied,
  onCopy,
  isLast
}) => {
  return (
    <motion.div
      key={item.name}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
        className={classNames(
          "flex items-center py-3 -mx-5 px-5 pr-24 hover:bg-gray-100 group relative",
          {
            "border-b border-gray-200": !isLast,
            "rounded-b-2xl": isLast,
          }
        )}
    >
      <div className="mr-3 flex-shrink-0 relative">
        {item.type === "people" ? (
          item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name}
              className="w-8 h-8 rounded-lg object-cover"
            />
          ) : (
            <FiUser
              size={16}
              className="w-9 h-9 text-pink-400 bg-pink-100 rounded-lg p-1"
            />
          )
        ) : item.type === "folder" ? (
          <div className="text-gray-500 w-9 h-9 bg-gray-100 rounded-lg p-1 flex justify-center items-center">
            <FaFolder />
          </div>
        ) : item.type === "image" ? (
          <div className="text-gray-500 w-9 h-9 bg-gray-100 rounded-lg p-1 flex justify-center items-center">
            <FaImage />
          </div>
        ) : (
          <div className="text-gray-500 w-9 h-9 bg-gray-100 rounded-lg p-1 flex justify-center items-center">
            <FaPlay />
          </div>
        )}

        {item.status && (
          <span
            className={classNames(
              "absolute -bottom-1 -right-1 block w-3 h-3 border-2 border-white rounded-full",
              {
                "bg-green-500": item.status === "active",
                "bg-yellow-500": item.status === "unactive",
              }
            )}
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium truncate flex items-center gap-2">
          {highlight(item.name, search)}
          {item.badge && (
            <span className="ml-2 font-normal bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">
              {item.badge}
            </span>
          )}
        </div>
        <div className="text-xs text-gray-500 font-normal truncate">
          {item.subtext}
        </div>
      </div>

      <div className="absolute right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onCopy(item.link)}
          data-tooltip-id="my-tooltip-2"
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition"
          title="Copy link"
        >
          <ImLink size={16} />
        </button>
        <Tooltip
          id="my-tooltip-2"
          place="top"
          variant="dark"
          noArrow
          content={
            copied
              ? ((
                  <span className="flex items-center gap-1">
                    <FiCheck className="text-white" size={12} />
                    Link copied!
                  </span>
                ) as unknown as string)
              : "Copy link"
          }
          style={{
            fontSize: "0.625rem",
            padding: "2px 6px 3px 6px",
            background: "black",
            color: "white",
          }}
        />
        <a
          href={"#"}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
          title="Open in new tab"
        >
          <RxExternalLink size={16} />
          <span className="text-xs">New Tab</span>
        </a>
      </div>
    </motion.div>
  );
};

export default ResultItem;
