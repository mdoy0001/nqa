import React, { useReducer } from "react";
import PropTypes from "prop-types";

import { useTheme } from '@mui/material/styles';
import { AppBar, Tabs, Tab, Typography, Box, Paper, Divider } from '@mui/material';

import { AdjustmentTab } from "./imageEditor/AdjustmentTab";
import { InfoTab } from "./info/InfoTab";
import { LibraryTab } from "./library/LibraryTab";



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function TabChild(props)
{
  switch(props.value)
  {
    case 0:
      return <LibraryTab/>
    case 1:
      return <InfoTab/>
    case 2:
      return <AdjustmentTab/>
  }
}

TabChild.propTypes = {
  value: PropTypes.number.isRequired,
}

export const Inspector = (props) => {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{minWidth: '30rem', display: 'inline-flex', flexDirection: 'column'}}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          centered
        >
          <Tab label="Library" {...a11yProps(0)} />
          <Tab label="Info" {...a11yProps(1)} />
          <Tab label="Adjustments" {...a11yProps(2)} />
        </Tabs>
        <Divider />
        <TabChild value={value}/>
    </Box>
  );
}

Inspector.propTypes = {

}