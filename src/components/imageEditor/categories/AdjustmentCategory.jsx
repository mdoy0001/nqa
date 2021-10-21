import React from 'react';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Slider, Stack, Box, Grid, Input, Accordion, AccordionSummary, Typography, AccordionDetails, Checkbox, FormControlLabel } from '@mui/material';
import { styled } from '@mui/material/styles';

export function InputSlider(props) {
  const handleSliderChange = (event, newValue) => {
    props.onChange(newValue);
  };

  const handleInputChange = (event) => {
    props.onChange(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (props.value < 0) {
      props.onChange(0);
    } else if (props.value > 100) {
      props.onChange(100);
    }
  };

  return (
    <Box>
      <Stack spacing={2} direction="row" alignItems="center">
        <Typography sx={{width: '8rem'}} id="input-slider" variant="caption" gutterBottom>
          {props.label}
        </Typography>

        <Slider
          value={props.value}
          size="small"
          onChange={handleSliderChange}
          aria-labelledby="input-slider"
          sx={props.sliderStyle}
        />

        <Input
          value={props.value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: 10,
            min: 0,
            max: 100,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
      </Stack>
    </Box>
  );
}

InputSlider.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  sliderStyle: PropTypes.object,
  onChange: PropTypes.func.isRequired
}

const StyledAccordionSummary = styled((props) => (
  <AccordionSummary expandIcon={<ExpandMoreIcon />} {...props}/>
))(({ theme }) => ({
  '& .MuiAccordionSummary-content': {
    margin: 0
  }
}));

// todo: allow enabled event to be passed.
export function AdjustmentCategory(props)
{

  const onClick = (e) => {
    e.stopPropagation();
    props.setValue(!props.checked);
  }

  return (
    <Accordion disableGutters defaultExpanded elevation={0} square>
      <StyledAccordionSummary>
        <FormControlLabel
        value={props.categoryValue}
        control={<Checkbox />}
        checked={props.checked}
        onClick={onClick}
        label={<Typography variant="subtitle1">{props.label}</Typography>}
        labelPlacement="end"
        sx={{m:0}}
        />
      </StyledAccordionSummary>
      <AccordionDetails>
        {props.children}
      </AccordionDetails>
  </Accordion>
  )
}

AdjustmentCategory.propTypes = {
  categoryValue: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  setValue: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.node
}