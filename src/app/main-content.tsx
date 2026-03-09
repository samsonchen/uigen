"use client";

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { FileSystemProvider } from "@/lib/contexts/file-system-context";
import { ChatProvider } from "@/lib/contexts/chat-context";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { FileTree } from "@/components/editor/FileTree";
import { CodeEditor } from "@/components/editor/CodeEditor";
import { PreviewFrame } from "@/components/preview/PreviewFrame";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderActions } from "@/components/HeaderActions";

interface MainContentProps {
  user?: {
    id: string;
    email: string;
  } | null;
  project?: {
    id: string;
    name: string;
    messages: any[];
    data: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

export function MainContent({ user, project }: MainContentProps) {
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");

  return (
    <FileSystemProvider initialData={project?.data}>
      <ChatProvider projectId={project?.id} initialMessages={project?.messages}>
        <div className="h-screen w-screen overflow-hidden" style={{ background: "#EAEDED" }}>
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Chat */}
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full flex flex-col bg-white">
                {/* Chat Header — Amazon dark nav */}
                <div className="h-14 flex items-center px-6 gap-3" style={{ background: "#131921" }}>
                  <svg viewBox="0 0 603 182" className="h-6 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M372.7 140.8c-35.3 26-86.5 39.9-130.6 39.9-61.8 0-117.4-22.8-159.5-60.8-3.3-3 .3-7.1 3.6-4.7 45.4 26.4 101.6 42.3 159.6 42.3 39.1 0 82.1-8.1 121.7-24.9 6-2.5 11 3.9 5.2 8.2z" fill="#FF9900"/>
                    <path d="M386.4 125.2c-4.5-5.8-29.9-2.7-41.3-1.4-3.5.4-4-2.6-.9-4.8 20.2-14.2 53.4-10.1 57.3-5.4 3.9 4.8-1 38.1-20 54-2.9 2.4-5.7 1.1-4.4-2.1 4.3-10.6 13.8-34.5 9.3-40.3z" fill="#FF9900"/>
                    <path d="M346.9 19.8V6.4c0-2 1.5-3.3 3.3-3.3h58.8c1.9 0 3.4 1.3 3.4 3.3v11.5c0 1.9-1.6 4.3-4.4 8.2l-30.5 43.5c11.3-.3 23.3 1.4 33.6 7.2 2.3 1.3 2.9 3.2 3.1 5.1v14.3c0 1.9-2.1 4.2-4.3 3-18.1-9.5-42.2-10.5-62.2.1-2 1.1-4.2-1.1-4.2-3V82.9c0-2.1 0-5.8 2.2-9l35.3-50.6h-30.8c-1.9 0-3.3-1.3-3.3-3.5zM124.2 99.1h-17.9c-1.7-.1-3.1-1.4-3.2-3.1V6.6c0-1.9 1.6-3.4 3.5-3.4h16.7c1.8.1 3.2 1.5 3.3 3.2v11.9h.3c4.4-11.6 12.6-17 23.7-17 11.3 0 18.4 5.4 23.5 17 4.3-11.6 14.2-17 24.8-17 7.5 0 15.7 3.1 20.7 10.1 5.7 7.8 4.5 19.1 4.5 29V96c0 1.9-1.6 3.4-3.5 3.4h-17.8c-1.8-.1-3.3-1.6-3.3-3.4V47.6c0-3.9.3-13.6-.5-17.3-1.3-6.2-5.2-7.9-10.2-7.9-4.2 0-8.6 2.8-10.4 7.3-1.8 4.5-1.6 12-.1 16.5V96c0 1.9-1.6 3.4-3.5 3.4h-17.8c-1.8-.1-3.3-1.6-3.3-3.4l-.1-48.4c0-10.2 1.7-25.2-10.7-25.2-12.5 0-12 14.6-12 25.2l-.3 48.1c0 1.9-1.6 3.4-3.5 3.4zm229.2 2.3c-34.5 0-53.2-29.6-53.2-67.3 0-39 20.8-67.5 53.2-67.5 34.1 0 52.6 30.2 52.6 67.1.1 39-20.8 67.7-52.6 67.7zm.2-24.9c17.2 0 18.3-23.5 18.3-38.1 0-14.7-.2-46.1-18.1-46.1-18.1 0-18.9 25.1-18.9 40.4 0 15.1.6 43.8 18.7 43.8zm96.2 24.9c-34.5 0-53.2-29.6-53.2-67.3 0-39 20.8-67.5 53.2-67.5 34.1 0 52.6 30.2 52.6 67.1.1 39-20.8 67.7-52.6 67.7zm.2-24.9c17.2 0 18.3-23.5 18.3-38.1 0-14.7-.2-46.1-18.1-46.1-18.1 0-18.9 25.1-18.9 40.4 0 15.1.6 43.8 18.7 43.8zm-321-24c0 13.6.3 24.9-6.5 37-5.5 9.9-14.3 15.9-24.1 15.9-13.4 0-21.2-10.2-21.2-25.2 0-29.6 26.6-35 51.8-35v7.3zm35.1 21.3c-2.3 2.1-5.6 2.2-8.2.8-11.5-9.6-13.6-14-19.9-23.1-19 19.4-32.5 25.2-57.2 25.2-29.2 0-51.9-18-51.9-54.1 0-28.2 15.3-47.4 37-56.8 18.8-8.4 45.1-9.9 65.2-12.2V47c0-8.1.6-17.7-4.1-24.7-4.1-6.2-12-8.8-18.9-8.8-12.9 0-24.3 6.6-27.1 20.3-.6 3.1-2.8 6.2-5.9 6.3l-17.3-1.9c-2.9-.6-6.1-3-5.3-7.5C52.1 8.1 84.6 0 110.3 0c13.1 0 30.3 3.5 40.7 13.4C163.4 23.7 162.3 37 162.3 52v43.8c0 13.5 5.6 19.5 10.9 26.8 1.9 2.6 2.3 5.6 0 7.5l-.4-.7z" fill="white"/>
                  </svg>
                  <span className="text-xs text-gray-400 font-normal tracking-wide uppercase mt-1">Component Gen</span>
                </div>

                {/* Chat Content */}
                <div className="flex-1 overflow-hidden">
                  <ChatInterface />
                </div>
              </div>
            </ResizablePanel>

            <ResizableHandle className="w-[1px] bg-neutral-200 hover:bg-neutral-300 transition-colors" />

            {/* Right Panel - Preview/Code */}
            <ResizablePanel defaultSize={65}>
              <div className="h-full flex flex-col bg-white">
                {/* Top Bar — Amazon secondary nav style */}
                <div className="h-14 px-6 flex items-center justify-between" style={{ background: "#232F3E" }}>
                  <Tabs
                    value={activeView}
                    onValueChange={(v) =>
                      setActiveView(v as "preview" | "code")
                    }
                  >
                    <TabsList className="bg-white/10 border border-white/20 p-0.5 h-9">
                      <TabsTrigger value="preview" className="data-[state=active]:bg-[#FF9900] data-[state=active]:text-[#0F1111] data-[state=active]:shadow-sm data-[state=active]:font-semibold text-gray-300 px-4 py-1.5 text-sm font-medium transition-all hover:text-white">Preview</TabsTrigger>
                      <TabsTrigger value="code" className="data-[state=active]:bg-[#FF9900] data-[state=active]:text-[#0F1111] data-[state=active]:shadow-sm data-[state=active]:font-semibold text-gray-300 px-4 py-1.5 text-sm font-medium transition-all hover:text-white">Code</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  <HeaderActions user={user} projectId={project?.id} />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-hidden" style={{ background: "#EAEDED" }}>
                  {activeView === "preview" ? (
                    <div className="h-full bg-white">
                      <PreviewFrame />
                    </div>
                  ) : (
                    <ResizablePanelGroup
                      direction="horizontal"
                      className="h-full"
                    >
                      {/* File Tree */}
                      <ResizablePanel
                        defaultSize={30}
                        minSize={20}
                        maxSize={50}
                      >
                        <div className="h-full bg-white border-r border-neutral-200">
                          <FileTree />
                        </div>
                      </ResizablePanel>

                      <ResizableHandle className="w-[1px] bg-neutral-200 hover:bg-neutral-300 transition-colors" />

                      {/* Code Editor */}
                      <ResizablePanel defaultSize={70}>
                        <div className="h-full bg-white">
                          <CodeEditor />
                        </div>
                      </ResizablePanel>
                    </ResizablePanelGroup>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </ChatProvider>
    </FileSystemProvider>
  );
}
