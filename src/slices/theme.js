import { createReducer, createAction, createSlice } from '@reduxjs/toolkit';
import { deleteFile, getFiles, moveFile, renameFile } from '../util/filesystem';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: false
  },
  reducers: {
    toggleDarkMode(state, action) {
      state.darkMode = !state.darkMode;
    }
  }
});

export const {actions, reducer} = themeSlice;