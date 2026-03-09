import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge, getToolLabel } from "../ToolInvocationBadge";

afterEach(() => {
  cleanup();
});

describe("getToolLabel", () => {
  it("returns 'Creating <path>' for str_replace_editor create", () => {
    expect(getToolLabel("str_replace_editor", { command: "create", path: "/App.jsx" })).toBe("Creating /App.jsx");
  });

  it("returns 'Editing <path>' for str_replace_editor str_replace", () => {
    expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "/App.jsx" })).toBe("Editing /App.jsx");
  });

  it("returns 'Editing <path>' for str_replace_editor insert", () => {
    expect(getToolLabel("str_replace_editor", { command: "insert", path: "/App.jsx" })).toBe("Editing /App.jsx");
  });

  it("returns 'Editing <path>' for str_replace_editor undo_edit", () => {
    expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Editing /App.jsx");
  });

  it("returns 'Reading <path>' for str_replace_editor view", () => {
    expect(getToolLabel("str_replace_editor", { command: "view", path: "/App.jsx" })).toBe("Reading /App.jsx");
  });

  it("returns 'Renaming <old> → <new>' for file_manager rename", () => {
    expect(getToolLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" })).toBe("Renaming /old.jsx → /new.jsx");
  });

  it("returns 'Deleting <path>' for file_manager delete", () => {
    expect(getToolLabel("file_manager", { command: "delete", path: "/old.jsx" })).toBe("Deleting /old.jsx");
  });

  it("falls back to the tool name for unknown tools", () => {
    expect(getToolLabel("some_unknown_tool", {})).toBe("some_unknown_tool");
  });

  it("falls back to the tool name when args are null", () => {
    expect(getToolLabel("str_replace_editor", null)).toBe("str_replace_editor");
  });
});

describe("ToolInvocationBadge", () => {
  it("shows a spinner when not done", () => {
    render(
      <ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.jsx" }} done={false} />
    );
    expect(screen.getByText("Creating /App.jsx")).toBeDefined();
    expect(document.querySelector(".animate-spin")).toBeDefined();
    expect(document.querySelector(".bg-emerald-500")).toBeNull();
  });

  it("shows a green dot when done", () => {
    render(
      <ToolInvocationBadge toolName="str_replace_editor" args={{ command: "create", path: "/App.jsx" }} done={true} />
    );
    expect(screen.getByText("Creating /App.jsx")).toBeDefined();
    expect(document.querySelector(".bg-emerald-500")).toBeDefined();
    expect(document.querySelector(".animate-spin")).toBeNull();
  });

  it("renders the correct label for file_manager delete", () => {
    render(
      <ToolInvocationBadge toolName="file_manager" args={{ command: "delete", path: "/utils/helper.js" }} done={true} />
    );
    expect(screen.getByText("Deleting /utils/helper.js")).toBeDefined();
  });
});
