import React, { useState } from "react";
import { MagicMotion } from "react-magic-motion";

interface SidebarProps {
  data: any[];
  onSelectFile: (content: string, name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ data, onSelectFile }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [collapsedDirectories, setCollapsedDirectories] = useState<{ [key: string]: boolean }>({});

  const toggleDirectory = (name: string) => {
    setCollapsedDirectories((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const renderTree = (items: any[]) => (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item) => (
        <li key={item.name} style={{ margin: "0.5rem 0" }}>
          {item.type === "directory" ? (
            <>
              <div
                onClick={() => toggleDirectory(item.name)}
                style={{ cursor: "pointer", fontWeight: "bold", paddingLeft: "8px" }}
              >
                {collapsedDirectories[item.name] ? "▶" : "▼"} {item.name}
              </div>
              {!collapsedDirectories[item.name] && renderTree(item.children)}
            </>
          ) : (
            <div
              onClick={() => onSelectFile(item.content, item.name)}
              style={{ cursor: "pointer", paddingLeft: "16px" }}
            >
              {item.name}
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <MagicMotion>
      <aside
        style={{
          backgroundColor: "rgba(23, 23, 23)",
          padding: "1rem",
          margin: "1rem 0",
          borderRadius: "0.65rem",
          width: isCollapsed ? "1.3rem" : "20rem",
          fontWeight: "bold",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {!isCollapsed && <h4 style={{ margin: 0 }}>Arquivos</h4>}

          <button
            style={{ cursor: "pointer", padding: 0, border: 0 }}
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
        </div>
        {!isCollapsed && renderTree(data)}
      </aside>
    </MagicMotion>
  );
};

export default Sidebar;
