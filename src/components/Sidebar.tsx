// Sidebar.tsx
import React from "react";
import { ComponentType } from "../types"; 
import { SIDEBAR } from "../AppConstant";

interface SidebarProps {
  componentPalette:any[];
  handleDragStart: (component: ComponentType, e: React.DragEvent<HTMLDivElement>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ componentPalette, handleDragStart }) => {
  return (
    <>
      <h3>{SIDEBAR.FIELDS}</h3>
      {componentPalette.map((item, index) => (
        <div
          key={item.key || index}
          draggable
          onDragStart={(e) => handleDragStart(item, e)}
          className="form-builder-draggable"
          role="button"
          tabIndex={0}
        >
          {item.label}
        </div>
      ))}
    </>
  );
};

export default Sidebar;
