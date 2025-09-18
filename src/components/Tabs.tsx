

import  { forwardRef } from "react";
import { motion } from "framer-motion";
import { IoSettingsOutline } from "react-icons/io5";
import { TabKey, type VisibleTabs } from "../types";
import { DROPDOWN_TABS, TABS } from "../constants";
import { mockResults } from "../JSON/mockData";
import DropdownItem from "./DropDownMenu";

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    visibleTabs: VisibleTabs;
    showDropdown: boolean;
    toggleDropdown: () => void;
    toggleTab: (
      tab: TabKey.Files | TabKey.People | TabKey.Chats | TabKey.Lists
    ) => void;
  }
  

// ✅ forwardRef lets parent attach a ref directly to Tabs
const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      activeTab,
      setActiveTab,
      visibleTabs,
      showDropdown,
      toggleDropdown,
      toggleTab,
    },
    dropdownWrapperRef
  ) => {
    const filteredTabs = TABS.filter(
      (tab) => tab.key === TabKey.All || visibleTabs[tab.key as keyof VisibleTabs]
    );

    return (
      <div className="flex border-b items-center justify-between px-2">
        {/* Tabs */}
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
                    ? mockResults.filter((i) => i.type === "people").length
                    : 0}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dropdown */}
        <div ref={dropdownWrapperRef} className="relative inline-block">
          <button
            className="ml-2 p-1 rounded flex-shrink-0"
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
                  isOn={visibleTabs[tab.key as keyof VisibleTabs]}
                  onToggle={() =>
                    toggleTab(
                      tab.key as
                        | TabKey.Files
                        | TabKey.People
                        | TabKey.Chats
                        | TabKey.Lists
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Tabs.displayName = "Tabs"; // required when using forwardRef
export default Tabs;
