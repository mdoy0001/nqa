import React, { useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import PropTypes from "prop-types";
import { ApertureContext, SelectDirectoryAction, SelectFileAction } from "../../pages/workspace";
import { mkdir, readdir, stat } from "fs/promises";
import {
  List,
  ListItem,
  Box,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography,
  Divider,
  Collapse,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  TextField,
  Input,
  ClickAwayListener
} from "@mui/material";

import FolderIcon from "@mui/icons-material/Folder";
import ImageIcon from "@mui/icons-material/Image";

import { paths } from "../../paths";
import path from "path";
import { ExpandLess } from "@mui/icons-material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';

import { deleteFile, getFiles, loadAdjustments, moveFile, renameFile } from "../../util/filesystem";
import { actions } from "../../slices/filesystem";
import { useDispatch, useSelector } from "react-redux";
import { resetAdjustments, setAdjustments } from "../../slices/adjustments";
import { useDrag, useDrop } from "react-dnd";
import theme from "../../theme";

function DirectoryNode(props) {
  const selectedDirectory = useSelector(state => state.filesystem.selectedDirectory);

  const file = props.file;
  const [isExpanded, setIsExpanded] = useState(false);

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'FILE',
    item: {type: 'FILE', path: file.filePath},
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [file.filePath]);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: 'FILE',
    canDrop: (item, monitor) => monitor.getItem().path !== file.filePath,
    drop: (item, monitor) => {
      props.sendAction({type: 'MOVE_FILE', payload:{
        src: item.path,
        dest: file.filePath,
      }});
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }), [file.filePath, props.sendAction]);

  const dndCallback = useCallback((node) => {
    drag(node);
    drop(node);
  });
  
  const secondaryClick = () => setIsExpanded(state => !state);

  const dispatch = useDispatch();
  const primaryClick = () => dispatch(actions.setSelectedDirectory(file.filePath));

  const level = props.level === undefined ? 0 : props.level;
  const t = useTheme(theme);

  return (
    <Box sx={{ pl: level, backgroundColor: (isOver && canDrop) ? t.palette.primary.light + '80' : undefined}}>
      <FsListItem
      ref={dndCallback}
      icon={<FolderIcon />}
      onClick={primaryClick}
      file={file}
      secondary = {
        <IconButton onClick={secondaryClick} edge="end" aria-label="comments">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      }
      selected={selectedDirectory == file.filePath}
      sendAction={props.sendAction}
      />
      {isExpanded && (
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding dense>
            <LibraryNodes files={file.children} level={level + 1} sendAction={props.sendAction} />
          </List>
        </Collapse>
      )}
    </Box>
  );
}

DirectoryNode.propTypes = {
  file: PropTypes.object.isRequired,
  sendAction: PropTypes.func.isRequired,
  level: PropTypes.number,
};


const SecondaryAction = (props) => {
  if (props.isDir)
  {
    return (
      <IconButton onClick={props.handleExpand} edge="end" aria-label="expand">
        {props.isExpanded ? <ExpandLess /> : <ExpandMore />}
      </IconButton>
    );
  }
}

SecondaryAction.propTypes = {
  handleExpand: PropTypes.func,
  isDir: PropTypes.bool,
  isExpanded: PropTypes.bool
}

const FsListItem = React.forwardRef((props, ref) => {

  const [menuElement, setMenuElement] = useState(null);
  const [anchorPos, setAnchorPos] = useState({left: 0, top: 0});

  const [isRenaming, setIsRenaming] = useState(false);

  const file = props.file;
  const name = file.name;

  const [rename, setRename] = useState(name);

  const open = Boolean(menuElement);

  const deleteId = 0;
  const renameId = 1;

  const handleContextMenu = (event) => {
    setMenuElement(event.currentTarget);
    setAnchorPos({left: event.clientX, top: event.clientY});
  };

  const handleClose = () => {
    setMenuElement(null);
  };

  const handleMenuItemClick = (index) => {
    setMenuElement(null);

    if (index == renameId) {
      setIsRenaming(true);
      setRename(name);
      // do renaming
    } else if (index == deleteId) {
      // delete
    }
  };

  const onRenameChange = (event) => {
    setRename(event.target.value);
  };

  const onKeyPress = (event) => {
    if (event.keyCode == 13) {
      setIsRenaming(false);
      props.sendAction({type: 'RENAME_FILE', payload: {
        src: file.filePath,
        name: rename,
      }});
    }
  }

  return (
    <ClickAwayListener onClickAway={() => {
      if (isRenaming) {
        setIsRenaming(false)
      }
    }}>
      <Box ref={ref}>
        <ListItem disablePadding secondaryAction={props.secondary} selected={props.selected} onContextMenu={handleContextMenu}>
          <ListItemButton onClick={props.onClick}>
            <ListItemIcon>
              { props.icon || <ImageIcon /> }
            </ListItemIcon>
            {isRenaming && <Input value={rename} onKeyDown={onKeyPress} onChange={onRenameChange} placeholder="Rename" variant="standard" size="small" margin="dense" /> || <ListItemText primary={name} />}
          </ListItemButton>
        </ListItem>
        <FsMenu open={open} anchorPos={anchorPos} menuElement={menuElement} onClose={handleClose} itemClick={handleMenuItemClick} />
      </Box>
    </ClickAwayListener>
  );
});

FsListItem.propTypes = {
  sendAction: PropTypes.func.isRequired,
  file: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  handleExpand: PropTypes.func,
  icon: PropTypes.node,
  selected: PropTypes.bool,
  secondary: PropTypes.node,
  isOver: PropTypes.bool,
}

const FsMenu = (props) => {
  return (
  <Menu
    open={props.open}
    anchorEl={props.menuElement}
    anchorPosition={props.anchorPos}
    onClose={props.onClose}
    anchorReference = "anchorPosition"
  >
    <MenuItem onClick={() => props.itemClick(0)}>
      <ListItemIcon><DeleteIcon /></ListItemIcon>
      <ListItemText>Delete</ListItemText>
    </MenuItem>
    <MenuItem onClick={() => props.itemClick(1)}>
      <ListItemIcon><DriveFileRenameOutlineIcon /></ListItemIcon>
      <ListItemText>Rename</ListItemText>
    </MenuItem>
  </Menu>
  );
}

FsMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  menuElement: PropTypes.object,
  anchorPos: PropTypes.object,
  file: PropTypes.object,
  onClose: PropTypes.func,
  itemClick: PropTypes.func
}

function FileNode(props) {
  const file = props.file;
  const level = props.level === undefined ? 0 : props.level

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'FILE',
    item: {type: 'FILE', path: file.filePath},
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [file.filePath]);

  const primaryFile = useSelector(state => state.filesystem.primaryFile);
  const dispatch = useDispatch();

  const handleClick = (event) => {
    dispatch(actions.setPrimaryFile(file.filePath));

    loadAdjustments(file.filePath).then((adjustments) => {
      setAdjustments(dispatch, adjustments);
    }).catch((err) => {
      // no file found
      resetAdjustments(dispatch);
    });
  };

  return (
    <Box sx={{ pl: level }} ref={drag}>
      <FsListItem onClick={handleClick} file={file} selected={file.filePath == primaryFile} sendAction={props.sendAction} />
    </Box>
  );
}

FileNode.propTypes = {
  file: PropTypes.object.isRequired,
  sendAction: PropTypes.func.isRequired,
  level: PropTypes.number,
};

function LibraryNodes(props) {
  const files = props.files;

  return files.map(f => {
    return f.isFile ? (
      <FileNode key={f.filePath} file={f} level={props.level} sendAction={props.sendAction} />
    ) : (
      <DirectoryNode key={f.filePath} file={f} level={props.level} sendAction={props.sendAction} />
    );
  });
}

LibraryNodes.propTypes = {
  files: PropTypes.array.isRequired,
  sendAction: PropTypes.func.isRequired,
  level: PropTypes.number,
};

const reducer = (state, action) => {
  switch(action.type) {
    case 'QUEUE_FETCH': {
      return {...state, fetchQueued: !state.fetchQueued};
    }
    case 'FETCH_FILES': {
      return {...state, fetching: true};
    }
    case 'FETCH_FILES_SUCCESS': {
      return {...state, fetching: false, files: action.payload};
    }
    case 'FETCH_FILES_FAILURE': {
      return {...state, fetching: false};
    }
    case 'DELETE_FILE': {
      const {src} = action.payload;
      return {...state, deleteFile: {src}};
    }
    case 'RENAME_FILE': {
      const {src, name} = action.payload;
      return {...state, renameFile: {src, name}};
    }
    case 'MOVE_FILE': {
      const {src, dest} = action.payload;
      return {...state, moveFile: {src, dest}};
    }
  }
}

export const LibraryTab = (props) => {
  const imageDirectory = path.join(useSelector(state => state.filesystem.baseDirectory), paths.imageLibrary);

  const [state, sendAction] = useReducer(reducer, {
    fetching: false,
    fetchQueued: false,
    files: [],
    deleteFile: undefined,
    renameFile: undefined,
    moveFile: undefined
  });

  const files = state.files;

  // Setup
  useEffect(() => {
    mkdir(imageDirectory, { recursive: true }).catch((err) => {
      throw new Error(err);
    });
  }, [imageDirectory]);

  // User actions
  useEffect(() => {
    if (state.deleteFile === undefined) return;

    const {src} = state.deleteFile;
    deleteFile(src).then(() => {
      sendAction({type: 'QUEUE_FETCH'});
    });
  }, [state.deleteFile]);

  useEffect(() => {
    if (state.renameFile === undefined) return;

    const {src, name} = state.renameFile;
    renameFile(src, name).then(() => {
      sendAction({type: 'QUEUE_FETCH'});
    });
  }, [state.renameFile]);

  useEffect(() => {
    if (state.moveFile === undefined) return;

    const {src, dest} = state.moveFile;
    moveFile(src, dest).then(() => {
      sendAction({type: 'QUEUE_FETCH'});
    });
  }, [state.moveFile]);


  // Update files
  useEffect(() => {
    sendAction({type: 'FETCH_FILES'});

    getFiles(imageDirectory).then((returnedFiles) => {
      sendAction({
        type: 'FETCH_FILES_SUCCESS',
        payload: returnedFiles
      });
    }).catch(() => {
      sendAction({
        type: 'FETCH_FILES_FAILURE'
      })
    });

  }, [imageDirectory, state.fetchQueued]);

  return (
    <Box sx={{minHeight:0, flexGrow: 1, overflow:'auto'}}>
      <List dense>
        <LibraryNodes files={files} sendAction={sendAction} />
      </List>
    </Box>
  );
};

// sliders backwards
LibraryTab.propTypes = {};
