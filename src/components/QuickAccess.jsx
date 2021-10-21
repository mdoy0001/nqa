import React, { useContext, useReducer } from "react";
import PropTypes from "prop-types";
import { AppBar, Toolbar, IconButton, Typography, Box, Tooltip } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import InfoIcon from '@mui/icons-material/Info';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import LabelIcon from '@mui/icons-material/Label';
import PhotoIcon from '@mui/icons-material/Photo';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import DarkModeIcon from '@mui/icons-material/DarkMode';

import { ApertureContext, SelectGridViewAction, SelectImageViewAction } from "../pages/workspace";
import { useDispatch } from "react-redux";
import { actions } from "../slices/theme";



export const QuickAccess = (props) => {

  const workspaceDispatch = useContext(ApertureContext).workspaceDispatch;
  const dispatch = useDispatch();

  return (
    <AppBar position="static">
      <Toolbar variant="dense"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
      >
        <IconButton edge="start" color="inherit" aria-label="inspector" sx={{ mr: 2 }}>
          <InfoIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="import" sx={{ mr: 2 }}>
          <ArrowDownwardIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="import" sx={{ mr: 2 }}>
          <AddIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="import" sx={{ mr: 2 }}>
          <PersonIcon />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="import" sx={{ mr: 2 }}>
          <LabelIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title="Toggle Darkmode">
          <IconButton edge="end" color="inherit" aria-label="grid view" onClick={() => dispatch(actions.toggleDarkMode())}>
            <DarkModeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Grid View">
          <IconButton edge="end" color="inherit" aria-label="grid view" sx={{ ml: 2 }} onClick={() => workspaceDispatch(SelectGridViewAction())}>
            <ViewComfyIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Image View">
          <IconButton edge="end" color="inherit" aria-label="image view" sx={{ ml: 2 }} onClick={() => workspaceDispatch(SelectImageViewAction())}>
            <PhotoIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}

QuickAccess.propTypes = {
}