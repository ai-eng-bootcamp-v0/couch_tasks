"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { syncToPinecone } from "@/lib/sync-to-pinecone";

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
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {isSyncing ? "Syncing..." : "Sync to Pinecone"}
    </Button>
  );
}
