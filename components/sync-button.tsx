"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { syncToPinecone } from "@/lib/sync-to-pinecone";
import { Database } from "lucide-react";

export default function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncToPinecone();

      if (result.success) {
      } else {
      }
    } catch (error) {
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button
      onClick={handleSync}
      disabled={isSyncing}
      variant="outline"
      size="sm"
      className="rounded-full text-xs h-8 flex items-center gap-1 bg-transparent border-gray-200 text-gray-600 hover:bg-gray-50"
    >
      <Database className="h-3 w-3 mr-1" />
      {isSyncing ? "Syncing..." : "Sync to Pinecone"}
    </Button>
  );
}
