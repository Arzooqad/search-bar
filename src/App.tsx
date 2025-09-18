import { AnimatePresence, motion } from "framer-motion";
import { 
  useSearch, 
  useTabs, 
  useDropdown, 
  useFilteredResults, 
  useCopyToClipboard 
} from "./hooks";
import SearchBar from "./components/SearchBar";
import Tabs from "./components/Tabs";
import ResultsList from "./components/ResultList";

function App() {
  const { search, showResults, loading, handleInput, clearSearch, setShowResults } = useSearch();
  const { activeTab, setActiveTab, visibleTabs, toggleTab } = useTabs();
  const { showDropdown, toggleDropdown, dropdownWrapperRef } = useDropdown();
  const { copied, handleCopy } = useCopyToClipboard();

  const filteredResults = useFilteredResults(activeTab, search);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl p-4">
        <SearchBar
          search={search}
          loading={loading}
          showResults={showResults}
          handleInput={handleInput}
          clearSearch={clearSearch}
          onFocus={() => setShowResults(search.length > 0)}
        />

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
              className="bg-white shadow p-0 rounded-b-lg origin-top"
              style={{ willChange: "opacity, transform, border-radius" }}
            >
              <Tabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                visibleTabs={visibleTabs}
                showDropdown={showDropdown}
                toggleDropdown={toggleDropdown}
                toggleTab={toggleTab}
                ref={dropdownWrapperRef}
              />
              <ResultsList
                loading={loading}
                filteredResults={filteredResults}
                search={search}
                copied={copied}
                onCopy={handleCopy}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;