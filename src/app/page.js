"use client";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { CssBaseline, IconButton, useMediaQuery } from "@mui/material";
import { useNav } from "./Components/hooks/useNav";
import { MobileNav } from "./Components/Navbar/MobileNav";
import { DesktopNav } from "./Components/Navbar/DesktopNav";
import MenuIcon from "@mui/icons-material/Menu";

export default function Home() {
  const {
    navItems,
    isEditing,
    mobileOpen,
    editingId,
    handleDragEnd,
    handleTitleChange,
    toggleVisibility,
    handleSave,
    handleDiscard,
    setEditingId,
    toggleEditMode,
    toggleMobileNav,
  } = useNav();

  const [isMobile, setIsMobile] = useState(false);
  const mq = useMediaQuery("(max-width:768px)"); 

  useEffect(() => {
    setIsMobile(mq);
  }, [mq]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend} options={{enableMouseEvents: true}}>
      <CssBaseline />

      {isMobile && (
        <IconButton
          onClick={toggleMobileNav}
          sx={{
            position: "fixed",
            top: 26,
            right: 21,
            zIndex: 1200,
            width: 57,
            height: 57,
            border: '1px solid #F0F0F0',
            borderRadius: 2.34,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MenuIcon sx={{
            width: 24,
            height: 24,
          }} />
        </IconButton>
      )}

      {isMobile ? (
        <MobileNav
          open={mobileOpen}
          onClose={toggleMobileNav}
          items={navItems}
          isEditing={isEditing}
          editingId={editingId}
          handleDragEnd={handleDragEnd}
          handleTitleChange={handleTitleChange}
          toggleVisibility={toggleVisibility}
          setEditingId={setEditingId}
          toggleEditMode={toggleEditMode}
          handleDiscard={handleDiscard}
          handleSave={handleSave}
        />
      ) : (
        <DesktopNav
          items={navItems}
          isEditing={isEditing}
          editingId={editingId}
          handleDragEnd={handleDragEnd}
          handleTitleChange={handleTitleChange}
          toggleVisibility={toggleVisibility}
          setEditingId={setEditingId}
          toggleEditMode={toggleEditMode}
          handleDiscard={handleDiscard}
          handleSave={handleSave}
        />
      )}

    </DndProvider>
  );
}
