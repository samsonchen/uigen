"use client";

import { Loader2 } from "lucide-react";

export function getToolLabel(toolName: string, args: any): string {
  if (toolName === "str_replace_editor" && args) {
    const file = args.path ?? "";
    switch (args.command) {
      case "create": return `Creating ${file}`;
      case "str_replace":
      case "insert":
      case "undo_edit": return `Editing ${file}`;
      case "view": return `Reading ${file}`;
    }
  }
  if (toolName === "file_manager" && args) {
    switch (args.command) {
      case "rename": return `Renaming ${args.path} → ${args.new_path}`;
      case "delete": return `Deleting ${args.path}`;
    }
  }
  return toolName;
}

interface ToolInvocationBadgeProps {
  toolName: string;
  args: any;
  done: boolean;
}

export function ToolInvocationBadge({ toolName, args, done }: ToolInvocationBadgeProps) {
  const label = getToolLabel(toolName, args);

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
