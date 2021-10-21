import { createReducer, createAction, createSlice } from '@reduxjs/toolkit';
import { deleteFile, getFiles, moveFile, renameFile } from '../util/filesystem';

const filesystemSlice = createSlice({
  name: 'filesystem',
  initialState: {
    primaryFile: '',
    selectedDirectory: '',
    baseDirectory: ''
  },
  reducers: {
    addSelectedFile(state, action) {
      const file = action.payload;
      state.selectedFiles.push(file);
    },
    clearSelectedFiles(state, action) {
      state.selectedFiles = [];
    },
    removeSelectedFile(state, action) {
      state.selectedFiles = state.selectedFiles.filter((file, i) => {
        const remFile = action.payload;

        return (file.path !== remFile.path) && (file.isDir !== remFile.isDir);
      })
    },
    setSelectedDirectory(state, action) {
      state.selectedDirectory = action.payload;
    },
    setBaseDirectory(state, action) {
      state.baseDirectory = action.payload;
    },
    setPrimaryFile(state, action) {
      state.primaryFile = action.payload;
    },
  }
});

export const {actions, reducer} = filesystemSlice;