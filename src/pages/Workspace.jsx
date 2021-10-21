import React, { useReducer, useState } from "react";
import PropTypes from "prop-types";
import { Inspector } from "../components/Inspector";
import { EditorView } from "../components/imageEditor/EditorView";
import { ProofSheetView } from "../components/proofSheet/ProofSheetView";
import { QuickAccess } from "../components/QuickAccess";
import { Box, Stack, Paper, Divider } from "@mui/material";
import { configureStore } from '@reduxjs/toolkit';

import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { actions } from "../slices/filesystem";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export const ApertureContext = React.createContext({
  baseDirectory: '/',
  workspaceDispatch: () => {throw new Error()}
})

const initialState = {
  view: 'imageView',
  selectedFile: undefined,
  selectedDirectory: undefined
}

function reducer(state, action)
{
  switch (action.type) {
    case 'selectGridView':
      return {...state, view: 'gridView'};
    case 'selectImageView':
      return {...state, view: 'imageView'};
    case 'selectFile':
      return {...state, selectedFile: action.payload}
    case 'selectDirectory':
      return {...state, selectedDirectory: action.payload}
    default:
      throw new Error();
  }
}

export function SelectFileAction(filePath)
{
  return {
    type: 'selectFile',
    payload: filePath
  }
}

export function SelectDirectoryAction(directoryPath)
{
  return {
    type: 'selectDirectory',
    payload: directoryPath
  }
}

export function SelectGridViewAction() {
  return {
    type: 'selectGridView'
  }
}

export function SelectImageViewAction() {
  return {
    type: 'selectImageView'
  }
}

function View(props) {
  switch(props.view)
  {
    case 'gridView':
      return <ProofSheetView dir={props.dir} />
    case 'imageView':
      return <EditorView file={props.file} />
    default:
      throw new Error();
  }
}

View.propTypes = {
  view: PropTypes.string.isRequired,
  dir: PropTypes.string,
  file: PropTypes.string
}

export const Workspace = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const baseDir = useSelector(state => state.filesystem.baseDirectory);
  const disp = useDispatch();

  if (baseDir !== props.baseDirectory)
  {
    disp(actions.setBaseDirectory(props.baseDirectory));
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ApertureContext.Provider value={{
        baseDirectory: props.baseDirectory,
        workspaceDispatch: dispatch
      }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', height:'100%'}}>
          <Box sx={{ display: 'flex'}}>
            <QuickAccess />
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'auto' }}>
            <Inspector />
            <Divider orientation="vertical" flexItem />
            <View view={state.view} dir={state.selectedDirectory} file={state.selectedFile}/>
          </Box>
        </Box>
      </ApertureContext.Provider>
    </DndProvider>
  )
}

Workspace.propTypes = {
  baseDirectory: PropTypes.string.isRequired,
}