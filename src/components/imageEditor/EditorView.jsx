import React, { useEffect, useState, useContext, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";


import { getImageBuffer } from "./adjustment";
import { render } from './render';
import { actions, selectAdjustments } from "../../slices/adjustments";
import { useDispatch, useSelector } from "react-redux";

/* Takes a canvas element and a parent element, updates the canvas' size on resize and returns its size. */
export const useBoundingSize = (canvas, parent) => {
  const initialWidth = parent !== undefined ? parent.getBoundingClientRect().width : 1;
  const initialHeight = parent !== undefined ? parent.getBoundingClientRect().height : 1;

  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    if (parent === undefined) return;

    
    const updateSize = () => {
      setWidth(parent.getBoundingClientRect().width);
      setHeight(parent.getBoundingClientRect().height);
    }

    updateSize();

    window.addEventListener("resize", updateSize);
    return () => { window.removeEventListener("resize", updateSize); };
  }, [parent]);

  useEffect(() => {
    if (canvas === undefined) return;

    canvas.width = width;
    canvas.height = height;
  }, [canvas, width, height]);

  return {width: width, height: height};
}

export const EditorView = (props) => {
  const [canvas, setCanvas] = useState(undefined);
  const [parentElement, setParentElement] = useState(undefined);

  const {width, height} = useBoundingSize(canvas, parentElement);

  const [rerender, setRerender] = useState(false);
  const [originalImg, setOriginalData] = useState(undefined);

  const processing = useRef(false);
  const queue = useRef(0);

  const adjustments = selectAdjustments();

  const primaryFile = useSelector(state => state.filesystem.primaryFile);

  const dispatch = useDispatch();

  
  const onCanvasChange = useCallback(node => {
    if (node !== null) { 
      setCanvas(node);
    }
  })

  const onParentElementChange = useCallback(node => {
    if (node !== null)
    {
      setParentElement(node);
    }
  })

  useEffect(() => {
    queue.current += 1;
    const id = queue.current;

    if (originalImg !== undefined && !processing.current)
    {
      const { data } = originalImg;
      processing.current = true;

      render(adjustments, data, canvas).then((hist) => {
        processing.current = false;

        const arr = [...hist];

        const channels = arr.slice(0, 100);

        dispatch(actions.setHistogram(channels));

        if (id != queue.current)
        {
          setRerender(!rerender);
        }
      });
    }
  }, [
    originalImg,
    width,
    height,
    adjustments,
    rerender,
  ])

  useEffect(async () => {
    if (primaryFile === undefined || primaryFile == '')
      return;
    
    var cancelled = false;

    const res = await getImageBuffer(primaryFile);

    if (cancelled) return;

    setOriginalData(res);

    return () => cancelled = true;
  }, [
    primaryFile,
  ])

  // When the path to our image is changed, we want to use Sharp to convert it into raw pixel data in the LAB colour format.

  // This can then be passed to a web worker, which can apply adjustments and then return it to us.
  // If the adjustments are changed before the worker returns (or the file path is changed), then we can simply cancel the worker and start again with the new adjustments.

  return (
    <Box sx={{flexGrow: 1, display: 'flex', minWidth: 0, minHeight: 0, p:2}}>
      <Box ref={onParentElementChange} sx={{flexGrow: 1}}>
        <canvas ref={onCanvasChange} style={{position: 'absolute'}}/>
      </Box>
      {/* <img key='image' src={imgString} decoding='async' ref={onRefChange} style={{objectFit: 'contain', height: '100%', width: '100%', overflow: 'hidden'}} /> */}
    </Box>
  )
}

EditorView.propTypes = {
}