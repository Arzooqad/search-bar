import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  FiCheck,
  FiExternalLink,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { ImLink, ImSpinner8 } from "react-icons/im";
import { FaFolder, FaImage, FaPlay } from "react-icons/fa";
import { mockResults } from "./JSON/mockData";
import SkeletonRow from "./components/Skeleton";
import { DROPDOWN_TABS, TabKey, TABS } from "./constants";
import DropdownItem from "./components/DropDownMenu";
import { highlight } from "./utils/utils";
import { IoSettingsOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";



function App() {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleTabs, setVisibleTabs] = useState({
    [TabKey.Files]: true,
    [TabKey.People]: true,
    [TabKey.Chats]: false,
    [TabKey.Lists]: false,
  });

  const [loading, setLoading] = useState(false);
  const loadingTimeout = useRef<NodeJS.Timeout | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopy = async (link: string | undefined) => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const filteredTabs = TABS.filter(
    (tab) => tab.key === TabKey.All || visibleTabs[tab.key]
  );

  const dropdownWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownWrapperRef.current &&
        !dropdownWrapperRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtered results
  const filteredResults = useMemo(() => 
    mockResults
      .filter((item) => {
        if (activeTab === "all") return true;
        if (activeTab === "files")
          return item.type === "files" || item.type === "folder";
        if (activeTab === "people") return item.type === "people";
        return false;
      })
      .filter((item) => item.name.toLowerCase().includes(search.toLowerCase())),
    [activeTab, search]
  );
  
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setShowResults(value.length > 0);
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
    if (value.length > 0) {
      setLoading(true);
      loadingTimeout.current = setTimeout(() => {
        setLoading(false);
      }, 600);
    } else {
      setLoading(false);
    }
  }, []);


  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev); // toggle instead of always open
  }, []);
  
  const toggleTab = useCallback((
    tab: TabKey.Files | TabKey.People | TabKey.Chats | TabKey.Lists
  ) => {
    setVisibleTabs((prev) => ({ ...prev, [tab]: !prev[tab] }));
    if (activeTab === tab && !visibleTabs[tab]) setActiveTab(TabKey.All);
  }, [activeTab, visibleTabs]);


  const clearSearch = useCallback(() => {
    setSearch("");
    setShowResults(false);
    setLoading(false);
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg p-4">
        {/* Search Bar */}
        <div
          className={`relative flex items-center bg-white shadow px-4 py-3 ${
            showResults ? "rounded-t-xl" : "rounded-xl"
          }`}
        >
          {loading ? (
            <ImSpinner8 className="text-gray-400 mr-2 animate-spin" size={20} />
          ) : (
            <FiSearch className="text-gray-400 mr-2" size={20} />
          )}
          <input
            className="flex-1 outline-none bg-transparent text-lg"
            placeholder="Search..."
            value={search}
            onChange={handleInput}
            onFocus={() => setShowResults(search.length > 0)}
          />
          {search && (
            <button
              className="ml-2 py-1 pl-1 rounded hover:bg-gray-100 text-xs underline"
              onClick={clearSearch}
              type="button"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              key="results-panel"
              initial={{
                opacity: 0,
                scaleY: 0.95,
                borderRadius: "0 0 1rem 1rem",
              }}
              animate={{ opacity: 1, scaleY: 1, borderRadius: "0 0 1rem 1rem" }}
              exit={{ opacity: 0, scaleY: 0.95, borderRadius: "0 0 1rem 1rem" }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              className="bg-white shadow p-0 border-t border-gray-100 rounded-b-lg origin-top"
              style={{ willChange: "opacity, transform, border-radius" }}
            >
              {/* Tabs */}
              <div className="flex border-b items-center justify-between px-2">
                <div className="flex flex-1 overflow-x-auto hide-scrollbar">
                  {filteredTabs.map((tab) => (
                    <button
                      key={tab.key}
                      className={`py-2 px-3 text-center text-sm font-medium transition border-b-2 flex items-center gap-1 ${
                        activeTab === tab.key
                          ? "border-black text-black"
                          : "border-transparent text-gray-500 hover:text-black"
                      }`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.icon && tab.icon}
                      <span>{tab.label}</span>
                      {tab.key !== "all" && (
                        <span
                          className={`ml-1 text-xs px-1.5 rounded-md ${
                            activeTab === tab.key
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tab.key === "files"
                            ? mockResults.filter(
                                (i) => i.type === "files" || i.type === "folder"
                              ).length
                            : tab.key === "people"
                            ? mockResults.filter((i) => i.type === "people")
                                .length
                            : null}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Wrapper with relative positioning */}
                <div ref={dropdownWrapperRef} className="relative inline-block">
                  <button
                    className="ml-2 p-1 rounded hover:bg-gray-100 flex-shrink-0"
                    onClick={toggleDropdown}
                    type="button"
                  >
                    <motion.div
                      animate={{ rotate: showDropdown ? 90 : 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      <IoSettingsOutline size={20} className="text-gray-500" />
                    </motion.div>
                  </button>

                  {showDropdown && (
                    <div
                      className="absolute right-0 mt-2 w-52 max-w-xs bg-white border rounded-lg shadow-xl z-20 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {DROPDOWN_TABS.map((tab) => (
                        <DropdownItem
                          key={tab.key}
                          label={tab.label}
                          icon={tab.icon}
                          isOn={visibleTabs[tab.key]}
                          onToggle={() => toggleTab(tab.key)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Results List */}
              <motion.div
                initial={{
                  opacity: 0,
                  scaleY: 0.95,
                  borderRadius: "0 0 1rem 1rem",
                }}
                animate={{
                  opacity: 1,
                  scaleY: 1,
                  borderRadius: "0 0 1rem 1rem",
                }}
                exit={{
                  opacity: 0,
                  scaleY: 0.95,
                  borderRadius: "0 0 1rem 1rem",
                }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
                className="bg-white shadow p-0 border-t border-gray-100 rounded-b-lg origin-top"
                style={{ willChange: "opacity, transform, border-radius" }}
              >
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="skeleton"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {Array.from({ length: 6 }).map((_, idx) => (
                        <SkeletonRow key={idx} />
                      ))}
                    </motion.div>
                  ) : filteredResults.length > 0 ? (
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {filteredResults.map((item, idx) => (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 24 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 24 }}
                          transition={{ duration: 0.35, delay: idx * 0.04 }}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 group relative"
                        >
                          {/* Icon/avatar */}
                          <div className="mr-3 flex-shrink-0">
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
                          </div>

                          {/* Text */}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate flex items-center gap-2">
                              {highlight(item.name, search)}
                              {item.badge && (
                                <span className="ml-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {item.subtext}
                            </div>
                          </div>

                          <div className="absolute right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => handleCopy(item.link)}
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
                                copied ? (
                                  <span className="flex items-center gap-1">
                                    <FiCheck className="text-white" size={12} />
                                    Link copied!
                                  </span>
                                ) : (
                                  "Copy link"
                                )
                              }
                              style={{
                                fontSize: "10px",
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
                              <FiExternalLink size={16} />
                              <span className="text-xs">New Tab</span>
                            </a>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 24 }}
                      transition={{ duration: 0.35 }}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      No results found.
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
