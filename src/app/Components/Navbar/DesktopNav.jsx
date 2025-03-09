import { DndContext } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Box, IconButton, Typography } from '@mui/material';
import { NavItem } from './NavItem';
import SettingsIcon from '../icons/SettingsIcon';
import DiscardIcon from '../icons/DiscardIcon';
import SaveIcon from '../icons/SaveIcon';

export const DesktopNav = ({ 
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
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{
        width: 440,
        bgcolor: '#FFFFFF',
        height: '100vh',
        padding:"0 2px",
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
      }}>

        <Box sx={{
          width: 436,
          height: 98,
          borderBottom: '1px solid #E9E9E9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3
        }}>
          <Typography sx={{
            fontFamily: 'DM Sans',
            fontWeight: 500,
            fontSize: 25,
            lineHeight: '26.22px',
            color: '#404040'
          }}>
            Menu
          </Typography>
          
          <Box sx={{ display: 'flex', gap: '8.7px' }}>
            {isEditing ? (
              <>
                <IconButton 
                  onClick={() => {
                    handleDiscard();
                    toggleEditMode();
                  }}
                  sx={{ p: 0 }}
                >
                  <DiscardIcon width={30} height={30} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    handleSave();
                    toggleEditMode();
                  }}
                  sx={{ p: 0 }}
                >
                  <SaveIcon width={30} height={30} />
                </IconButton>
              </>
            ) : (
              <IconButton 
                onClick={toggleEditMode} 
                sx={{ p: 0 }}
              >
                <SettingsIcon width={30} height={30} />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box sx={{
          width: 436,
          p: '32px 14px',
          height: 'calc(100vh - 98px)',
          overflowX: 'hidden',
        }}>
          <SortableContext 
            items={items}
            strategy={verticalListSortingStrategy}
          >
            <Box sx={{
              width: 412,
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              {items.map(item => (
                <NavItem
                  key={item.id}
                  item={item}
                  depth={0}
                  isMobile={false}
                  isEditing={isEditing}
                  editingId={editingId}
                  onTitleChange={handleTitleChange}
                  onToggleVisibility={toggleVisibility}
                  onEditClick={setEditingId}
                  sx={{
                    width: 412,
                    minHeight: 65,
                    borderRadius: '4px',
                    bgcolor: '#F7F7F7',
                    '&:hover': {
                      bgcolor: isEditing ? '#F7F7F7' : '#F0F0F0'
                    }
                  }}
                />
              ))}
            </Box>
          </SortableContext>
        </Box>
      </Box>
    </DndContext>
  );
};