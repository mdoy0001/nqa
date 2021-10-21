import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ImageList, ImageListItem, ImageListItemBar, useTheme, Typography, Box, Skeleton, Divider } from "@mui/material";
import { getFiles } from "../../util/filesystem";
import theme from "../../theme";



import { nativeImage } from "electron";
import { PsToolbar } from "./PsToolbar";
import { useSelector } from "react-redux";


const PsThumbnail = (props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageSource, setImageSource] = useState(''); // TODO: dummy loading image?

  useEffect(() => {
    const p = nativeImage.createThumbnailFromPath(props.file.filePath, {width: 256, height: 256}).then((img) => {
      setIsLoaded(true);
      setImageSource(img.toDataURL());
    })
  }, [props.file])


  return (
    <ImageListItem sx={{
      '& > img': {
        objectFit: 'cover',
        aspectRatio: '1',
        minWidth: 0,
        minHeight: 0,
        cursor: 'pointer',
        border: props.selected ? '2px solid blue' : ''
      },
      minWidth: 0,
      minHeight: 0,
    }}>
      {
      isLoaded ?
      <img
          src={`${imageSource}`}
          alt={props.file.name}
          loading="lazy"
          decoding="async"
          onClick={props.select}
        /> :
        <Skeleton variant="rectangular" sx={{objectFit: 'cover', width:'100%', height: 'auto', flexGrow: 1, aspectRatio: '1', minWidth: 0}} />
      }
      <ImageListItemBar
        title={<Typography variant="caption" color={props.selected ? 'primary.main' : undefined}>{props.file.name}</Typography>}
        position="below"
      />
    </ImageListItem>
  )
}

PsThumbnail.propTypes = {
  file: PropTypes.object.isRequired,
  selected: PropTypes.bool,
  select: PropTypes.func
}

export const ProofSheetView = (props) => {

  const [files, setFiles] = useState([]);
  const [selectedMap, setSelectedMap] = useState(new Map());
  const [zoom, setZoom] = useState(0);

  const updateSelected = (k, v) => {
    if (v === true)
    {
      setSelectedMap(new Map(selectedMap.set(k, v)));
    }
    else {
      
      selectedMap.delete(k);
      setSelectedMap(new Map(selectedMap));
    }
  }

  const dir = useSelector(state => state.filesystem.selectedDirectory);

  const colsFromZoom = (zoom) => {
    const minZoom = 0;
    const maxZoom = 100;

    const maxCols = 12;
    const minCols = 5;

    
    return Math.min(Math.floor((maxCols - minCols) * ((maxZoom - zoom) / (maxZoom - minZoom)) + minCols), files.length);
  }

  const handleZoomChange = (event, newZoom) => {
    setZoom(newZoom);
  }

  useEffect(() => {
    if (dir !== undefined && dir !== '')
    {
      getFiles(dir).then((f) => {
        setFiles(f);
      });
    }
  }, [dir]);

  return (
    <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'column-reverse'}}>
      <PsToolbar zoom={zoom} selectedMap={selectedMap} handleZoomChange={handleZoomChange} />
      <Divider flexItem />
      <Box sx={{flexGrow: 1, overflow: 'auto', minHeight: 0, minWidth: 0}}>
        <ImageList sx={{ padding: '4px', margin: 0, minWidth: 0, minHeight:0, transform: 'translateZ(0)' }} cols={colsFromZoom(zoom)}>
          {files.filter(f => f.isFile).map(f => {
            const select = () => updateSelected(f.filePath, !selectedMap.get(f.filePath));
            const isSelected = selectedMap.get(f.filePath);

            return <PsThumbnail key={f.filePath} file={f} selected={isSelected} select={select}/>
          })}
        </ImageList>
      </Box>
    </Box>
  )
}

ProofSheetView.propTypes = {
}