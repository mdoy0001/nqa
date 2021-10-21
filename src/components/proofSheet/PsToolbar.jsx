import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import { Box, Toolbar, IconButton, Slider, Stack, Paper, Tooltip, } from "@mui/material";


import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import { actions } from "../../slices/adjustments";
import { useDispatch } from "react-redux";
import { loadAdjustments, saveAdjustments } from "../../util/filesystem";
import { useSelector } from "react-redux";

export const PsToolbar = (props) => {
  const dispatch = useDispatch();

  const adj = useSelector(state => state.adjustments.copiedAdjustments);

  return (
    <Box>
      <Toolbar variant="dense"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}
      >
        <Tooltip title="Select">
          <IconButton edge="start" color="inherit" aria-label="select" sx={{ mr: 2 }}>
            <DesignServicesIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Copy metadata/adjustments">
          <span>
            <IconButton
              edge="start"
              color="inherit"
              disabled={props.selectedMap.size !== 1}
              aria-label="copy metadata and adjustments"
              sx={{ mr: 2 }}
              onClick = {() => {
                loadAdjustments([props.selectedMap.keys().next().value]).then((adjustments) => {
                  dispatch(actions.copyAdjustments(adjustments));
                }).catch((err) => {
                  console.log(err);
                });
              }}>
              <ContentCopyIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Paste metadata/adjustments">
          <span>
            <IconButton
              disabled={props.selectedMap.size < 1 || adj === undefined}
              edge="start"
              color="inherit"
              aria-label="paste metadata and adjustments"
              sx={{ mr: 2 }}
              onClick = {() => {
                const filesToAdjust = Array.from(props.selectedMap.keys());
                saveAdjustments(filesToAdjust, adj);
              }}>
              <ContentPasteIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Box sx={{flexGrow: 1}} />
        <Box sx={{width: 200}}>
          <Stack spacing={2} direction="row" alignItems="center">
              <Tooltip title="Smaller Thumbnails"><ZoomOutIcon /></Tooltip>
              <Slider color="primary" aria-label="Thumbnail Size" value={props.zoom} onChange={props.handleZoomChange}/>
              <Tooltip title="Larger Thumbnails"><ZoomInIcon /></Tooltip>
          </Stack>
        </Box>
      </Toolbar>
    </Box>
  );
}

PsToolbar.propTypes = {
  zoom: PropTypes.number,
  selectedMap: PropTypes.object,
  handleZoomChange: PropTypes.func
}