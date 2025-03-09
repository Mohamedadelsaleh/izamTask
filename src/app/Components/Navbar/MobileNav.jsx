import { Box, Button, IconButton, SwipeableDrawer, Typography } from '@mui/material';
import { DndContext, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { NavItem } from './NavItem';
import SettingsIcon from '../icons/SettingsIcon';
import SaveIcon from '../icons/SaveIcon';
import BackIcon from '../icons/BackIcon';
import { useState } from 'react';

export const MobileNav = ({ 
  open,
  onClose,
  items,
  isEditing,
  editingId,
  handleDragEnd,
  handleTitleChange,
  toggleVisibility,
  setEditingId,
  toggleEditMode,
  handleSave,
  handleDiscard,
}) => {

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(PointerSensor)
  );

  const [isDragging, setIsDragging] = useState(false);

  return (
    <SwipeableDrawer
      anchor={isEditing ? 'none' : 'right'}
      open={open}
      onClose={isEditing ? undefined : onClose}
      disableDiscovery={isEditing}
      disableSwipeToOpen={true}
      ModalProps={{
        keepMounted: true,
        BackdropProps: isEditing ? { invisible: true } : undefined
      }}
      sx={{
        '& .MuiDrawer-paper': {
          width: '100%',
        }
      }}
    >
      <Box sx={{
        width: '100%',
        height: 75,
        borderBottom: '1px solid #E9E9E9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        py: 3,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <IconButton
            onClick={() => {
              if (isEditing) toggleEditMode();
              onClose();
            }}
            sx={{ p: 0 }}
          >
            <BackIcon sx={{ width: 15, height: 16 }} />
          </IconButton>
          <Typography sx={{
            fontFamily: 'DM Sans',
            fontWeight: 400,
            fontSize: 17,
            lineHeight: '100%',
            color: '#161616'
          }}>
            Menu
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: '8.7px' }}>
          {isEditing ? (
            <>
              <IconButton
                onClick={() => {
                  handleSave();
                  toggleEditMode();
                }}
                sx={{ p: 0 }}
              >
                <SaveIcon width={26.6} height={26.6} />
              </IconButton>
            </>
          ) : (
            <IconButton 
              onClick={toggleEditMode} 
              sx={{ p: 0 }}
            >
              <SettingsIcon width={26.6} height={26.6} />
            </IconButton>
          )}
        </Box>
      </Box>
        <DndContext 
          sensors={sensors}
          onDragStart={() => {
            setIsDragging(true);
            document.documentElement.style.setProperty('overflow', 'hidden', 'important');
          }}
          onDragEnd={(e) => {
            handleDragEnd(e);
            setIsDragging(false);
            document.documentElement.style.removeProperty('overflow');
          }}
        >
          <Box sx={{
            padding: '32px 0px',
            flexGrow: 1,
            overflowY: isDragging ? 'hidden' : 'auto'
          }}>
          <SortableContext 
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{
              width: '365.18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              margin: '0 auto'
            }}>
              {items.map(item => (
                  <NavItem
                    key={item.id}
                    item={item}
                    depth={0}
                    isEditing={isEditing}
                    editingId={editingId}
                    onTitleChange={handleTitleChange}
                    onToggleVisibility={toggleVisibility}
                    onEditClick={setEditingId}
                    isMobile={true}
                    sx={{
                      width: '365.18px',
                      height: '57.61px',
                      borderRadius: '3.55px',
                      gap: '24px',
                      bgcolor: '#F7F7F7',
                      padding: '0 24px !important',
                      '&:hover': {
                        bgcolor: isEditing ? '#F0F0F0' : '#F0F0F0'
                      }
                    }}
                  />
                ))}
            </Box>
          </SortableContext>
          {isEditing && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                onClick={handleDiscard}
                sx={{
                  fontFamily: 'DM Sans',
                  fontWeight: 500,
                  fontSize: 14,
                  lineHeight: '100%',
                  color: '#ED1F03',
                  textTransform: 'none'
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
          </Box>
        </DndContext>
    </SwipeableDrawer>
  );
};