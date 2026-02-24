"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getCourseSuggestions } from "@/app/actions/course";

interface UniversalSearchProps {
  placeholder?: string;
  className?: string;
  helperText?: string;
  variant?: "default" | "large";
}

export function UniversalSearch({
  placeholder = "Search for courses...",
  className = "",
  helperText = "Press Enter to see all results",
  variant = "default",
}: UniversalSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<{ id: string; title: string }[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync internal query with URL if it changes (e.g. back button)
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query && !isFocused) {
      setQuery(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isFocused]);

  // Handle suggestions fetching
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }
      const results = await getCourseSuggestions(query);
      setSuggestions(results);
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  // Handle search with debounce - Refined logic to fix infinite loops
  useEffect(() => {
    // Stop if the query is the same as the URL to avoid extra pushes
    const currentQ = searchParams.get("q") || "";
    if (query === currentQ) return;

    const timeout = setTimeout(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (!query) {
        current.delete("q");
      } else {
        current.set("q", query);
      }

      const search = current.toString();
      const queryStr = search ? `?${search}` : "";

      // Only navigate if on /courses or we have a query (to redirect to courses)
      if (window.location.pathname === "/courses") {
        router.push(`/courses${queryStr}`, { scroll: false });
      }
    }, 800); // 800ms "Finish typing" debounce

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, router]); // Removed searchParams dependency to fix the loop

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
      setShowSuggestions(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : prev));
      setShowSuggestions(true);
    } else if (e.key === "Enter") {
      if (selectedIndex > -1 && suggestions[selectedIndex]) {
        router.push(`/courses?q=${encodeURIComponent(suggestions[selectedIndex].title)}`);
        setQuery(suggestions[selectedIndex].title);
        setShowSuggestions(false);
      } else {
        router.push(`/courses?q=${encodeURIComponent(query)}`);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (title: string) => {
    setQuery(title);
    setShowSuggestions(false);
    router.push(`/courses?q=${encodeURIComponent(title)}`);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative group">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isFocused ? 'text-primary' : 'text-slate-400'}`} />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            // Delay closing to allow clicking suggestions
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          className={`
            w-full pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-blue-500/20 rounded-full 
            focus-visible:ring-2 focus-visible:ring-primary/20 dark:focus-visible:ring-blue-500/30 focus-visible:border-primary dark:focus-visible:border-blue-500 
            transition-all text-sm dark:text-slate-200 dark:placeholder:text-slate-500
            ${variant === "large" ? "h-12 text-base" : "h-10"}
          `}
          placeholder={placeholder}
          type="text"
        />
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-blue-500/20 shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="px-3 py-1.5 mb-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Course Suggestions
            </div>
            {suggestions.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => handleSuggestionClick(s.title)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`
                  w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center gap-3
                  ${selectedIndex === idx ? "bg-slate-50 dark:bg-slate-800 text-primary dark:text-blue-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"}
                `}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedIndex === idx ? "bg-primary/10 dark:bg-blue-500/20" : "bg-slate-100 dark:bg-slate-800/80"}`}>
                  <Search className={`w-4 h-4 ${selectedIndex === idx ? "text-primary dark:text-blue-400" : "text-slate-400 dark:text-slate-500"}`} />
                </div>
                <span className="font-semibold text-sm truncate">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Helper Text */}
      <div 
        className={`
          absolute left-4 top-full mt-1.5 transition-all duration-200 
          ${isFocused ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1 pointer-events-none"}
        `}
      >
        <span className="text-[10px] font-bold text-primary dark:text-blue-400 uppercase tracking-widest bg-white dark:bg-slate-900 px-2 py-0.5 rounded-full border border-slate-100 dark:border-blue-500/20 shadow-sm">
          {helperText}
        </span>
      </div>
    </div>
  );
}
