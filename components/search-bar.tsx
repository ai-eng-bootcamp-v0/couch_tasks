"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Zap, ArrowRight } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  initialQuery?: string;
}

export default function SearchBar({
  placeholder = "Ask anything...",
  className = "",
  initialQuery = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [deepResearch, setDeepResearch] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    const isDeepEnabled = searchParams.has("deep");
    setQuery(currentQuery);
    setDeepResearch(isDeepEnabled);
    setIsSearching(false);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitSearch();
  };

  const submitSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const currentQueryParam = searchParams.get("q");

    if (!query && !currentQueryParam) {
      setIsSearching(false);
      return;
    }

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    if (deepResearch) {
      params.set("deep", "true");
    } else {
      params.delete("deep");
    }

    setIsSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 10000);

    router.push(`/?${params.toString()}`);
  };

  const toggleDeepResearch = () => {
    setDeepResearch(!deepResearch);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-8">
        What do you want to know?
      </h1>
      <div className="relative">
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
          <div className="rounded-sm bg-gray-100 text-[10px] text-gray-600 py-0.5 px-1.5 font-medium">
            pro
          </div>
        </div>
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative rounded-full shadow-sm border border-gray-200 bg-white">
            <Input
              type="text"
              placeholder={placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-14 pr-32 py-6 h-16 rounded-full border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              disabled={isSearching}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                variant={deepResearch ? "default" : "outline"}
                size="sm"
                onClick={toggleDeepResearch}
                className={`rounded-full text-xs px-3 py-1 h-8 flex items-center gap-1 
                }`}
              >
                <Zap className={`h-3 w-3`} />
                Deep Research
              </Button>
              <Button
                type="submit"
                variant="default"
                size="icon"
                className="rounded-full h-8 w-8 bg-gray-100 hover:bg-gray-200"
                disabled={isSearching}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 text-gray-800 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4 text-gray-800" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
