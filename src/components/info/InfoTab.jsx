import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Typography, Box, ListItem, List, ListItemText } from "@mui/material";

const sharp = require('sharp');


export const InfoTab = (props) => {
  const primaryFile = useSelector(state => state.filesystem.primaryFile);
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    if (primaryFile !== '' && primaryFile !== undefined)
    {
      sharp(primaryFile).metadata().then((data) => {
        setMetadata(data);
      })
    }
  }, [primaryFile])

  return (
    <Box>
      <List>
      <ListItem><ListItemText primary="Format" secondary={metadata.format} /></ListItem>
      <ListItem><ListItemText primary="Width" secondary={metadata.width} /></ListItem>
      <ListItem><ListItemText primary="Height" secondary={metadata.height} /></ListItem>
      <ListItem><ListItemText primary="Colour Space" secondary={metadata.space} /></ListItem>
      <ListItem><ListItemText primary="Colour Depth" secondary={metadata.depth} /></ListItem>
      </List>
    </Box>
  )
}

InfoTab.propTypes = {

}