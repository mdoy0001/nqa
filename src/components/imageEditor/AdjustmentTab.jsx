import React, {useCallback, useEffect, useState} from "react";
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Divider,
} from "@mui/material";
import { WhiteBalance } from "./Categories/WhiteBalance";
import { Exposure } from "./Categories/Exposure";
import { Enhance } from "./Categories/Enhance";
import { Highlights } from "./Categories/Highlights";
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { drawHistogram } from "./render";
import { useBoundingSize } from "./EditorView";
import { useTheme } from "@emotion/react";

import theme from "../../theme";

const StyledPaper = styled((props) => (
  <Paper elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`
}));

export const AdjustmentTab = (props) => {
  const hist = useSelector(state => state.adjustments.histogram);
  const t = useTheme(theme);

  const [ canvas, setCanvas ] = useState(undefined);
  const [ canvasParent, setCanvasParent ] = useState(undefined);

  const {width, height} = useBoundingSize(canvas, canvasParent);
  
  const handleCanvasRef = useCallback(node => {
    if (node !== undefined) {
      setCanvas(node);
    }
  })

  const handleParentRef = useCallback(node => {
    if (node !== undefined) {
      setCanvasParent(node);
    }
  })

  useEffect(() => {
    if (canvas !== undefined)
    {
      drawHistogram(hist, canvas, t.palette.primary.light);
    }
  }, [hist, width, height, canvas])

  return (
    <Box sx={{minHeight:0, flexGrow: 1, overflow:'auto'}}>
      <Paper ref={handleParentRef} square el={1} sx={{ margin: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant='subtitle1' sx={{ margin: 1, marginBottom: 0 }}>Histogram</Typography>
        <Typography variant='caption' color="text.secondary" sx={{ margin: 1, marginTop: 0 }}>Lightness (Linear)</Typography>
        <canvas ref={handleCanvasRef} style={{maxHeight: 100, flexGrow: 1, width: '100%'}} />
      </Paper>
      <Divider />
      <WhiteBalance />
      <Divider />
      <Exposure />
      <Divider />
      <Enhance />
      <Divider />
      <Highlights />
      <Divider />
    </Box>
  );
};
