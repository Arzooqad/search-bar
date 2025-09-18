import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { TabKey, type VisibleTabs } from '../types';
import { mockResults } from '../JSON/mockData';

export const useSearch = () => {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const clearSearch = useCallback(() => {
    setSearch("");
    setShowResults(false);
    setLoading(false);
    if (loadingTimeout.current) clearTimeout(loadingTimeout.current);
  }, []);

  return {
    search,
    showResults,
    loading,
    handleInput,
    clearSearch,
    setShowResults
  };
};

export const useTabs = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [visibleTabs, setVisibleTabs] = useState<VisibleTabs>({
    [TabKey.Files]: true,
    [TabKey.People]: true,
    [TabKey.Chats]: false,
    [TabKey.Lists]: false,
  });

  const toggleTab = useCallback((
    tab: TabKey.Files | TabKey.People | TabKey.Chats | TabKey.Lists
  ) => {
    setVisibleTabs((prev) => ({ ...prev, [tab]: !prev[tab] }));
    if (activeTab === tab && !visibleTabs[tab]) setActiveTab(TabKey.All);
  }, [activeTab, visibleTabs]);

  return {
    activeTab,
    setActiveTab,
    visibleTabs,
    toggleTab
  };
};

export const useDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
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

  const toggleDropdown = useCallback(() => {
    setShowDropdown((prev) => !prev);
  }, []);

  return {
    showDropdown,
    toggleDropdown,
    dropdownWrapperRef
  };
};

export const useFilteredResults = (activeTab: string, search: string) => {
  return useMemo(() => 
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
};

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (link: string | undefined) => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return { copied, handleCopy };
};