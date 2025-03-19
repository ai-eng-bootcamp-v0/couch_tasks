"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import searchToKeywords from "@/lib/search";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = "Search...",
  className = "",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchToKeywords(query);
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
        />
      </div>
      <Button
        type="submit"
        variant="default"
        size="icon"
        className="h-10 w-10 rounded-lg bg-neutral-900 hover:bg-neutral-700"
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
