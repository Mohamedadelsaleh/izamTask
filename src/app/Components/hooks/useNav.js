import { useState, useEffect } from "react";
import axios from "axios";

export const useNav = () => {
  const [originalItems, setOriginalItems] = useState([]);
  const [editedItems, setEditedItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const flattenItems = (items) => {
    return items.reduce((acc, item) => {
      acc.push(item);
      if (item.children) acc.push(...flattenItems(item.children));
      return acc;
    }, []);
  };

  const updateItemInTree = (items, id, updateFn) => {
    return items.map((item) => {
      if (item.id === id) return updateFn(item);
      if (item.children)
        return {
          ...item,
          children: updateItemInTree(item.children, id, updateFn),
        };
      return item;
    });
  };

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const { data } = await axios.get("/api/nav");
        setOriginalItems(data);
        setEditedItems(structuredClone(data));
      } catch (error) {
        console.error("Error fetching nav:", error);
      }
    };
    fetchNav();
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const findItem = (items, id, parentPath = []) => {
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) return { item: items[i], index: i, parentPath };
        if (items[i].children) {
          const found = findItem(items[i].children, id, [...parentPath, i]);
          if (found) return found;
        }
      }
      return null;
    };

    const activeItem = findItem(editedItems, active.id);
    const overItem = findItem(editedItems, over.id);

    if (!activeItem || !overItem) return;

    if (activeItem.parentPath.length !== overItem.parentPath.length) return;

    setEditedItems((items) => {
      const newItems = structuredClone(items);
      const activeParent = activeItem.parentPath.reduce(
        (acc, idx) => acc.children[idx],
        { children: newItems }
      );
      const overParent = overItem.parentPath.reduce(
        (acc, idx) => acc.children[idx],
        { children: newItems }
      );

      const [moved] = activeParent.children.splice(activeItem.index, 1);

      overParent.children.splice(overItem.index, 0, moved);

      return newItems;
    });

    try {
      await axios.post("/api/track", {
        id: active.id,
        from: activeItem.index,
        to: overItem.index,
      });
    } catch (error) {
      console.error("Tracking error:", error);
    }
  };

  const toggleVisibility = (id) => {
    setEditedItems((items) =>
      updateItemInTree(items, id, (item) => ({
        ...item,
        visible: item.visible === undefined ? false : !item.visible,
      }))
    );
  };

  const handleTitleChange = (id, newTitle) => {
    setEditedItems((items) =>
      updateItemInTree(items, id, (item) => ({
        ...item,
        title: newTitle,
      }))
    );
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/nav", editedItems);
      setOriginalItems(structuredClone(editedItems));
      setIsEditing(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleDiscard = () => {
    setEditedItems(structuredClone(originalItems));
    setIsEditing(false);
  };

  return {
    navItems: editedItems,
    isEditing,
    mobileOpen,
    editingId,
    handleDragEnd,
    handleTitleChange,
    toggleVisibility,
    handleSave,
    handleDiscard,
    setEditingId,
    toggleEditMode: () => setIsEditing(!isEditing),
    toggleMobileNav: () => setMobileOpen(!mobileOpen),
  };
};
