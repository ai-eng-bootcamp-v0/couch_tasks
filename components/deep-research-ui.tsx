"use client";

import { useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Loader2, FileText, Search, PenLine } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DeepResearchUIProps {
  searchQuery: string;
}

export default function DeepResearchUI({ searchQuery }: DeepResearchUIProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(false);

  const { messages, append } = useChat({
    api: "/api/research",
    initialMessages: [],
    body: {
      searchQuery,
    },
    id: `research-${searchQuery}`,
    onResponse: () => {
      setLoading(false);
    },
    onError: () => {
      setLoading(false);
    },
  });

  useEffect(() => {
    if (!isInitialized && searchQuery) {
      setIsInitialized(true);
      setLoading(true);

      append({
        role: "user",
        content: searchQuery,
      });
    }
  }, [searchQuery, isInitialized, append]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Deep Research
          </CardTitle>
          <CardDescription>Researching: {searchQuery}</CardDescription>
        </CardHeader>
      </Card>

      {loading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Initializing research...</p>
        </div>
      )}

      <div className="space-y-6">
        {messages.map((message) => {
          const hasToolCalls =
            message.toolInvocations && message.toolInvocations.length > 0;

          if (message.role === "user") return null;

          return (
            <div key={message.id} className="space-y-4">
              {message.content && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </CardContent>
                </Card>
              )}

              {hasToolCalls && (
                <div className="space-y-4 pl-4 border-l-2 border-primary/20">
                  {message.toolInvocations?.map((toolInvocation) => {
                    const { toolName, toolCallId, state } = toolInvocation;

                    return (
                      <Card
                        key={toolCallId}
                        className={cn(
                          "border-l-4",
                          state !== "result" &&
                            "border-l-yellow-500 bg-yellow-50",
                          state === "result" && "border-l-green-500 bg-green-50"
                        )}
                      >
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm flex items-center gap-2">
                            {toolName === "webSearch" && (
                              <Search className="h-4 w-4" />
                            )}
                            {toolName === "writeToResearchPlan" && (
                              <PenLine className="h-4 w-4" />
                            )}
                            {toolName}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="py-0 pb-3">
                          {state !== "result" && (
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              {toolName === "webSearch" && (
                                <div>Searching web...</div>
                              )}
                              {toolName === "writeToResearchPlan" && (
                                <div>Updating research plan...</div>
                              )}
                            </div>
                          )}

                          {state === "result" && (
                            <div className="h-[200px] overflow-auto rounded-md border p-3 text-sm">
                              {toolName === "webSearch" && (
                                <div className="whitespace-pre-wrap font-mono text-xs">
                                  {toolInvocation.result}
                                </div>
                              )}
                              {toolName === "writeToResearchPlan" && (
                                <div className="whitespace-pre-wrap">
                                  <h3 className="font-medium mb-2">
                                    Research Plan:
                                  </h3>
                                  {toolInvocation.result}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {messages.length > 0 && !loading && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Research Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] overflow-auto">
              <div className="whitespace-pre-wrap">
                {messages.filter((m) => m.role === "assistant").pop()?.content}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && messages.length > 0 && (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mr-2" />
          <p className="text-muted-foreground">Researching...</p>
        </div>
      )}
    </div>
  );
}
