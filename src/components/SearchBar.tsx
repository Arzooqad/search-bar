import React from 'react';
import { FiSearch } from "react-icons/fi";
import { ImSpinner8 } from "react-icons/im";

interface SearchBarProps {
  search: string;
  loading: boolean;
  showResults: boolean;
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  onFocus: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  loading,
  showResults,
  handleInput,
  clearSearch,
  onFocus
}) => {
  return (
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
        onFocus={onFocus}
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
  );
};

export default SearchBar;