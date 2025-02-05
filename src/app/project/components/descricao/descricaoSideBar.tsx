import React, { useState } from "react";
import { IoChevronForward, IoChevronDown, IoChevronBack } from "react-icons/io5";

interface SidebarProps {
  data: any[];
  onSelectFile: (content: string, name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ data, onSelectFile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedDirectories, setCollapsedDirectories] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedFile, setSelectedFile] = useState<string>("")

  const toggleDirectory = (name: string) => {
    setCollapsedDirectories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderTree = (items: any[]) => {
    if (!Array.isArray(items)) {
      console.error("renderTree recebeu um valor inválido:", items);
      return null;
    }
  
    return (
      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item) => {
          if (!item || typeof item.name !== "string" || !item.type) {
            console.error("Item inválido detectado:", item);
            return null;
          }
  
          return (
            <li key={item.name}>
              {item.type === "directory" && item.name !== "img" ? (
                <div>
                  <div
                    onClick={() => toggleDirectory(item.name)}
                    style={{
                      cursor: "pointer",
                      paddingLeft: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                    className="font-fustat font-bold text-xl"
                  >
                    {collapsedDirectories[item.name] ? (
                      <IoChevronForward />
                    ) : (
                      <IoChevronDown />
                    )}{" "}
                    {item.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </div>
                  {!collapsedDirectories[item.name] && renderTree(item.children)}
                </div>
              ) : (
                <div
                  onClick={() => {
                    onSelectFile(item.content, item.name)
                    setSelectedFile(item.name)
                  }}
                  style={{ cursor: "pointer"}}
                  className={`font-fustat p-2 rounded-md font-light text-base ${selectedFile === item.name  && "bg-[#2D2D2D]"} `}
                >
                  {item.name.split(".")[0].replace(/[-_]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
      <aside
        style={{
          backgroundColor: "#1B1B1B",
          padding: "1rem",
          margin: "1rem 0",
          borderRadius: "0.65rem",
          width: isCollapsed ? "1.3rem" : "15rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflow: "hidden",
        }}
        className="font-fustat shadow-lg"
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "end",
          }}
        >

          <button
            style={{ cursor: "pointer", border: 0 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <IoChevronForward /> : <IoChevronBack />}
          </button>
        </div>
        {!isCollapsed && renderTree(data)}
      </aside>
  );
};

export default Sidebar;
