import React from 'react';
import { AnimatePresence, motion } from "framer-motion";
import ResultItem from './ResultItem';
import type { SearchResult } from '../types';
import SkeletonRow from './Skeleton';

interface ResultsListProps {
  loading: boolean;
  filteredResults: SearchResult[];
  search: string;
  copied: boolean;
  onCopy: (link: string | undefined) => void;
}

const ResultsList: React.FC<ResultsListProps> = ({
  loading,
  filteredResults,
  search,
  copied,
  onCopy
}) => {
  return (
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
      className="bg-white shadow px-5 p-0 pt-2 border-gray-100 rounded-b-lg origin-top"
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
              <ResultItem
                key={item.name}
                item={item}
                search={search}
                index={idx}
                copied={copied}
                onCopy={onCopy}
                isLast={idx === filteredResults.length - 1}

              />
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
  );
};

export default ResultsList;