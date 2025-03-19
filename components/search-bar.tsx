"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  initialQuery?: string;
}

export default function SearchBar({
  placeholder = "Search for cities, countries, or difficulty levels...",
  className = "",
  initialQuery = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    setQuery(currentQuery);
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
    setIsSearching(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearching(false);
    }, 10000);

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

    router.push(`/?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex w-full max-w-md items-center gap-2 ${className}`}
    >
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-10 h-10 rounded-lg border-neutral-200 focus-visible:ring-neutral-400"
          disabled={isSearching}
        />
      </div>
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="h-10 w-10 rounded-lg bg-neutral-900 hover:bg-neutral-700"
        disabled={isSearching}
      >
        {isSearching ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
