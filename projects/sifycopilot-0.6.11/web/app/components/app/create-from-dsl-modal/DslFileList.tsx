"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "@/app/components/base/button";
import { useAppContext } from "@/context/app-context";
import { useProviderContext } from "@/context/provider-context";
import { useContext } from "use-context-selector";
import { ToastContext } from "@/app/components/base/toast";
import { useRouter } from "next/navigation";
import { importApp } from "@/service/apps";
import { NEED_REFRESH_APP_LIST_KEY } from "@/config";
import { getRedirection } from "@/utils/app-redirection";
import Check from "../../base/icons/src/vender/line/general/Check";
import * as yaml from "js-yaml";

interface AppData {
  name: string;
  description: string;
  mode: string;
}

interface ParsedYAML {
  app: AppData;
}

const DSLFileList = ({
  onSelectFile,
}: {
  onSelectFile: (content: string) => void;
}) => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { notify } = useContext(ToastContext);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);
  const { isCurrentWorkspaceEditor } = useAppContext();
  const { plan, enableBilling } = useProviderContext();
  const isAppsFull =
    enableBilling && plan.usage.buildApps >= plan.total.buildApps;

  const dslFiles = [
    "automated_email_reply_copilot.yml",
    "copilot_investment_analysis_report .yml",
    "book_translation_copilot.yml",
  ];

  const handleSelectFile = async (fileName: string) => {
    if (isCreating || isAppsFull) return;

    setIsCreating(true);
    setSelectedFile(fileName);
    try {
      const response = await fetch(`/dsl_files/${fileName}`);
      if (!response.ok) {
        throw new Error(`File not found: ${fileName}`);
      }
      const fileContent = await response.text();

      const app = await importApp({
        data: fileContent,
      });

      notify({ type: "success", message: t("app.newApp.appCreated") });
      localStorage.setItem(NEED_REFRESH_APP_LIST_KEY, "1");
      getRedirection(isCurrentWorkspaceEditor, app, push);

      onSelectFile(fileContent);
    } catch (error) {
      console.error("Error creating app from DSL file:", error);
      notify({ type: "error", message: t("app.newApp.appCreateFailed") });
    } finally {
      setIsCreating(false);
    }
  };

  if (!dslFiles.length) {
    return (
      <div className="text-gray-500 dark:text-gray-400">
        {t("app.noFilesAvailable")}
      </div>
    );
  }
  const [fileData, setFileData] = useState<
    { name: string; description: string; mode: string }[]
  >([]);

  const fetchFileData = async (fileName: string) => {
    try {
      const response = await fetch(`/dsl_files/${fileName}`);
      if (!response.ok) {
        throw new Error(`File not found: ${fileName}`);
      }
      const fileContent = await response.text();
      console.log("comingg");
      // Parse the YAML content
      const parsedContent = yaml.load(fileContent) as ParsedYAML;
      console.log("parsed content::", parsedContent);
      const appData = parsedContent?.app || {};
      if (appData) {
        return {
          name: appData.name || "Untitled App",
          description: appData.description || "No description available.",
          mode: appData.mode || "Chat",
        };
      }
      return {
        name: "Untitled App",
        description: "No description available.",
        mode: "Chat",
      };
    } catch (error) {
      console.error("Error parsing DSL file:", error);
      return {
        name: "Untitled App",
        description: "Error loading description.",
        mode: "Chat",
      };
    }
  };

  useEffect(() => {
    const loadFilesData = async () => {
      const data = await Promise.all(dslFiles.map(fetchFileData));
      setFileData(data);
    };
    loadFilesData();
  }, []);

  return (
    <div className="mt-4">
      <h4 className="font-medium text-lg dark:text-white mb-3">
        Create from Templates
      </h4>
      <div className="flex flex-col gap-3">
        {dslFiles.map((fileName, index) => (
          <div
            key={fileName}
            className="relative group w-full transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            onMouseEnter={() => setHoveredFile(fileName)}
            onMouseLeave={() => setHoveredFile(null)}
          >
            {hoveredFile === fileName && (
              <div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                bg-gray-900 text-white px-2.5 py-1.5 rounded-md text-xs
                shadow-sm backdrop-blur-sm bg-opacity-90
                animate-fade-in whitespace-nowrap
                before:content-[''] before:absolute before:left-1/2 before:-bottom-1 
                before:w-2 before:h-2 before:bg-gray-900 before:rotate-45 
                before:-translate-x-1/2 before:bg-opacity-90"
              >
                Click to create from template
              </div>
            )}
            <Button
              type="button"
              onClick={() => handleSelectFile(fileName)}
              disabled={isCreating || isAppsFull}
              // className={`w-full h-auto min-h-[80px] p-4 rounded-lg border border-gray-200 dark:border-gray-700
              //   group-hover:border-gray-300 dark:group-hover:border-gray-600
              //   bg-white dark:bg-gray-800
              //   transition-all duration-200 ease-in-out
              className={`w-full h-auto min-h-[80px] p-4 rounded-lg border border-gray-200 dark:border-gray-700
                group-hover:border-gray-300 dark:group-hover:border-gray-600 dark:group-hover:bg-zinc-900
                bg-white dark:bg-[#2e2e2e] 
                transition-all duration-200 ease-in-out
                ${isCreating ? "opacity-50 cursor-not-allowed" : ""} 
                ${
                  selectedFile === fileName
                    ? "ring-2 ring-primary-600 dark:ring-primary-500"
                    : ""
                }
                group-hover:z-10 group-hover:relative`}
            >
              <div className="flex flex-col w-full gap-2">
                <div className="flex items-center justify-start">
                  {fileData[index]?.mode === "advanced-chat" && (
                    <img
                      className="w-8 h-8"
                      src="/assets/4.png"
                      alt="advanced-chat"
                    />
                  )}
                  {fileData[index]?.mode === "agent-chat" && (
                    <img
                      className="w-8 h-8"
                      src="/assets/1.png"
                      alt="agent-chat"
                    />
                  )}
                  {fileData[index]?.mode === "chat" && (
                    <img className="w-8 h-8" src="/assets/4.png" alt="chat" />
                  )}
                  {fileData[index]?.mode === "completion" && (
                    <img className="w-8 h-8" src="/assets/2.png" alt="chat" />
                  )}
                  {fileData[index]?.mode === "workflow" && (
                    <img className="w-8 h-8" src="/assets/3.png" alt="chat" />
                  )}
                  <span className="ml-1 text-gray-700 dark:text-gray-200 font-medium line-clamp-1">
                    {fileData[index]?.name || "Untitled App"}
                  </span>
                  {selectedFile === fileName && (
                    <div className="shrink-0 w-5 h-5 rounded-full bg-primary-600 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* <p className={`text-sm text-gray-500 dark:text-gray-400
                  line-clamp-2 group-hover:line-clamp-none
                  transition-all duration-200 break-words`}> */}
                <p
                  className="relative text-sm text-gray-500 dark:text-gray-400
                  line-clamp-1 group-hover:line-clamp-none
                  transition-all duration-200 break-words whitespace-normal text-ellipsis overflow-hidden"
                >
                  {fileData[index]?.description || "No description available."}
                </p>
              </div>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DSLFileList;
