import { useState, useEffect } from 'react';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  ListItem, 
  IconButton, 
  TextField, 
  Box, 
  Collapse,
  List
} from '@mui/material';
import { 
  DragHandle, 
  Edit, 
  Visibility, 
  VisibilityOff,
  ExpandMore
} from '@mui/icons-material';
import DragIcon from '../icons/DragIcon';

export const NavItem = ({ 
  item, 
  depth = 0,
  isEditing,
  editingId,
  onTitleChange,
  onToggleVisibility,
  onEditClick,
  isChild,
  isMobile,
}) => {
  const [naturalExpanded, setNaturalExpanded] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const effectiveExpanded = isEditing ? hasChildren : naturalExpanded;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    paddingLeft: `${depth * 24}px`,
  };

  const handleToggle = () => {
    if (!isEditing) setNaturalExpanded(!naturalExpanded);
  };

  useEffect(() => {
    if (!isEditing) setNaturalExpanded(false);
  }, [isEditing]);

  return (
    <>
    {(isEditing || item.visible !== false) && (
      <ListItem
        ref={setNodeRef}
        style={style}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          bgcolor: !isChild ? '#F7F7F7' : "#ffffff",
          width: (isMobile && !isChild) ? 365.2 :  (isMobile && isChild) ? 291 : (!isMobile && !isChild) ? 412 : 330,
          height: (isMobile && !isChild) ? 65 :  (isMobile && isChild) ? 52 : (!isMobile && !isChild) ? 57.6 : 52,
          padding: !isChild ? '19px 30px !important' : "0px !important",
          cursor: (hasChildren && !isEditing) ? 'pointer' : 'default',
        }}
        {...attributes}
      >
        {isEditing && (
          <IconButton
            {...listeners}
            size="small"
            sx={{ cursor: 'grab',touchAction: 'none', color: item.visible !== false ? 'action.active' : "#CDCDCD" }}
          >
            <DragIcon fontSize="small" fill={`${item.visible === false ? '#CDCDCD' : '#404040'}` } width={isMobile ? 10 : 18} height={isMobile ? 15 : 23} />
          </IconButton>
        )}

        <Box 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 352,
          }}
          onClick={handleToggle}
        >
          <Box sx={{ flexGrow: 1 }}>
            {isEditing && editingId === item.id ? (
              <TextField
                value={item.title}
                onChange={(e) => onTitleChange(item.id, e.target.value)}
                variant="standard"
                fullWidth
                InputProps={{ 
                  disableUnderline: true,
                  sx: { fontSize: '0.875rem' }
                }}
              />
            ) : (
              <span style={{ 
                fontWeight: 500,
                fontSize: depth === 0 ? '24px' : '22px',
                fontSize: (isMobile && !isChild) ? 17 :  (isMobile && isChild) ? 17 : (!isMobile && !isChild) ? 24 : 22,
                fontFamily: 'DM Sans',
                lineHeight: '26.22px',
                color: `${item.visible === false ? '#CDCDCD' : '#404040'}`
              }}>
                {item.title}
              </span>
            )}
          </Box>

          {hasChildren && !isEditing && (
            <IconButton 
              size="small" 
              sx={{
                transform: effectiveExpanded ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.2s ease',
                pointerEvents: isEditing ? 'none' : 'auto'
              }}
            >
              <ExpandMore fontSize="small" sx={{
                fill: '#000000',
              }} />
            </IconButton>
          )}
        </Box>

        {isEditing && (
          <Box sx={{ display: 'flex', gap: "8px" }}>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onEditClick(item.id);
              }}
              color={editingId === item.id ? 'primary' : 'default'}
            >
              <Edit fontSize="small" />
            </IconButton>
            
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleVisibility(item.id);
              }}
            >
              {item.visible !== false ? (
                <Visibility fontSize="small" />
              ) : (
                <VisibilityOff fontSize="small" />
              )}
            </IconButton>
          </Box>
        )}
      </ListItem>
    )}

      {/* Dropdown Children */}
      {hasChildren && (
        <Collapse in={effectiveExpanded} timeout="auto" unmountOnExit>
          <SortableContext 
            items={item.children.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <List sx={{
              padding: isMobile ? "0px 20.5px 14px 44.5px" : "0px 53.5px 14px",
              bgcolor: "#ffffff !important"
            }}>
              {item.children.map(child => (
                <NavItem
                  key={child.id}
                  item={child}
                  depth={depth + 1}
                  isEditing={isEditing}
                  editingId={editingId}
                  onTitleChange={onTitleChange}
                  onToggleVisibility={onToggleVisibility}
                  onEditClick={onEditClick}
                  isChild= {true}
                  isMobile={isMobile ? true : false}
                  sx={{
                    width: 412,
                    minHeight: 65,
                    borderRadius: '4px',
                    bgcolor: '#ffffff !important',
                    '&:hover': {
                      bgcolor: isEditing ? '#F7F7F7' : '#F0F0F0'
                    }
                  }}
                />
              ))}
            </List>
          </SortableContext>
        </Collapse>
      )}
    </>
  );
};