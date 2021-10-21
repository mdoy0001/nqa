import * as React from 'react';
import ReactDOM from 'react-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import theme, {dark} from './theme';
import { Workspace } from './pages/workspace';
import PropTypes from "prop-types";

import { reducer as filesystemReducer } from "./slices/filesystem";
import { reducer as adjustmentsReducer } from "./slices/adjustments";
import { reducer as themeReducer } from "./slices/theme";

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import { createTheme } from '@mui/system';
import { useSelector } from 'react-redux';

const store = configureStore({
  reducer: {
    filesystem: filesystemReducer,
    adjustments: adjustmentsReducer,
    theme: themeReducer,
  },
});

function App(props) {

  const darkMode = useSelector(state => state.theme.darkMode);



  return (
    <ThemeProvider theme={darkMode ? dark : theme}>
      <CssBaseline />
      <Workspace baseDirectory={props.baseDirectory}/>
    </ThemeProvider>
    )
}

App.propTypes = {
  baseDirectory: PropTypes.string.isRequired
}

export function Render(baseDirectory)
{
  ReactDOM.render(
    <Provider store={store}>
      <App baseDirectory={baseDirectory}/>
    </Provider>,
    document.querySelector('#app'),
  );
}