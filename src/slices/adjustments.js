import { createReducer, createAction, createSlice } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { saveAdjustments } from '../util/filesystem';

const defaultAdjustments = {
  whiteBalanceEnabled: false,
  exposureEnabled: false,
  enhanceEnabled: false,
  tonesEnabled: false,
  colorTemp: 50,
  tint: 50,
  exposure: 0,
  recovery: 50,
  blackpoint: 50,
  brightness: 50,
  contrast: 50,
  definition: 0,
  saturation: 50,
  vibrancy: 0,
  highlights: 50,
  shadows: 50,
  midtones: 50,
  histogram: [],
  copiedAdjustments: undefined,
}

const adjustmentsSlice = createSlice({
  name: 'adjustments',
  initialState: {
    ...defaultAdjustments
  },
  reducers: {
    setWhiteBalanceEnabled(state, action) {
      state.whiteBalanceEnabled = action.payload
    },
    setExposureEnabled(state, action) {
      state.exposureEnabled = action.payload;
    },
    setEnhanceEnabled(state, action) {
      state.enhanceEnabled = action.payload;
    },
    setTonesEnabled(state, action) {
      state.tonesEnabled = action.payload;
    },
    setColorTemp(state, action) {
      state.colorTemp = action.payload;
    },
    setTint(state, action) {
      state.tint = action.payload;
    },
    setExposure(state, action) {
      state.exposure = action.payload;
    },
    setRecovery(state, action) {
      state.recovery = action.payload;
    },
    setBlackpoint(state, action) {
      state.blackpoint = action.payload;
    },
    setBrightness(state, action) {
      state.brightness = action.payload;
    },
    setContrast(state, action) {
      state.contrast = action.payload;
    },
    setDefinition(state, action) {
      state.definition = action.payload;
    },
    setSaturation(state, action) {
      state.saturation = action.payload;
    },
    setVibrancy(state, action) {
      state.vibrancy = action.payload;
    },
    setHighlights(state, action) {
      state.highlights = action.payload;
    },
    setShadows(state, action) {
      state.shadows = action.payload;
    },
    setMidtones(state, action) {
      state.midtones = action.payload;
    },
    setHistogram(state, action) {
      state.histogram = action.payload;
    },
    copyAdjustments(state, action) {
      state.copiedAdjustments = action.payload;
    },
    pasteAdjustments(state, action) {
      const adjustments = state.copiedAdjustments;

      if (adjustments.colorTemp !== undefined) state.colorTemp = adjustments.colorTemp;
      if (adjustments.tint !== undefined) state.tint = adjustments.tint;
      if (adjustments.exposure !== undefined) state.exposure = adjustments.exposure;
      if (adjustments.recovery !== undefined) state.recovery = adjustments.recovery;
      if (adjustments.blackpoint !== undefined) state.blackpoint = adjustments.blackpoint;
      if (adjustments.brightness !== undefined) state.brightness = adjustments.brightness;
      if (adjustments.contrast !== undefined) state.contrast = adjustments.contrast;
      if (adjustments.definition !== undefined) state.definition = adjustments.definition;
      if (adjustments.saturation !== undefined) state.saturation = adjustments.saturation;
      if (adjustments.vibrancy !== undefined) state.vibrancy = adjustments.vibrancy;
      if (adjustments.highlights !== undefined) state.highlights = adjustments.highlights;
      if (adjustments.shadows !== undefined) state.shadows = adjustments.shadows;
      if (adjustments.midtones !== undefined) state.midtones = adjustments.midtones;
    }
  }
});

export const { actions, reducer } = adjustmentsSlice;

export const resetAdjustments = (dispatch) => {
  setAdjustments(dispatch, defaultAdjustments);
}

export const setAdjustments = (dispatch, adjustments) => {
  if (adjustments.whiteBalanceEnabled !== undefined) dispatch(actions.setWhiteBalanceEnabled(adjustments.whiteBalanceEnabled));
  if (adjustments.exposureEnabled !== undefined) dispatch(actions.setExposureEnabled(adjustments.exposureEnabled));
  if (adjustments.enhanceEnabled !== undefined) dispatch(actions.setEnhanceEnabled(adjustments.enhanceEnabled));
  if (adjustments.tonesEnabled !== undefined) dispatch(actions.setTonesEnabled(adjustments.tonesEnabled));


  if (adjustments.colorTemp !== undefined) dispatch(actions.setColorTemp(adjustments.colorTemp));
  if (adjustments.tint !== undefined) dispatch(actions.setTint(adjustments.tint));
  if (adjustments.exposure !== undefined) dispatch(actions.setExposure(adjustments.exposure));
  if (adjustments.recovery !== undefined) dispatch(actions.setRecovery(adjustments.recovery));
  if (adjustments.blackpoint !== undefined) dispatch(actions.setBlackpoint(adjustments.blackpoint));
  if (adjustments.brightness !== undefined) dispatch(actions.setBrightness(adjustments.brightness));
  if (adjustments.contrast !== undefined) dispatch(actions.setContrast(adjustments.contrast));
  if (adjustments.definition !== undefined) dispatch(actions.setDefinition(adjustments.definition));
  if (adjustments.saturation !== undefined) dispatch(actions.setSaturation(adjustments.saturation));
  if (adjustments.vibrancy !== undefined) dispatch(actions.setVibrancy(adjustments.vibrancy));
  if (adjustments.highlights !== undefined) dispatch(actions.setHighlights(adjustments.highlights));
  if (adjustments.shadows !== undefined) dispatch(actions.setShadows(adjustments.shadows));
  if (adjustments.midtones !== undefined) dispatch(actions.setMidtones(adjustments.midtones));
}

export const selectAdjustments = () => {
  const whiteBalanceEnabled = useSelector(state => state.adjustments.whiteBalanceEnabled);
  const exposureEnabled = useSelector(state => state.adjustments.exposureEnabled);
  const enhanceEnabled = useSelector(state => state.adjustments.enhanceEnabled);
  const tonesEnabled = useSelector(state => state.adjustments.tonesEnabled);
  const colorTemp = useSelector(state => state.adjustments.colorTemp);
  const exposure = useSelector(state => state.adjustments.exposure);
  const recovery = useSelector(state => state.adjustments.recovery);
  const blackpoint = useSelector(state => state.adjustments.blackpoint);
  const brightness = useSelector(state => state.adjustments.brightness);
  const contrast = useSelector(state => state.adjustments.contrast);
  const definition = useSelector(state => state.adjustments.definition);
  const saturation = useSelector(state => state.adjustments.saturation);
  const vibrancy = useSelector(state => state.adjustments.vibrancy);
  const highlights = useSelector(state => state.adjustments.highlights);
  const shadows = useSelector(state => state.adjustments.shadows);
  const midtones = useSelector(state => state.adjustments.midtones);

  const adjustments = {
    whiteBalanceEnabled,
    exposureEnabled,
    enhanceEnabled,
    tonesEnabled,
    colorTemp,
    exposure,
    recovery,
    blackpoint,
    brightness,
    contrast,
    definition,
    saturation,
    vibrancy,
    highlights,
    shadows,
    midtones
  };

  return adjustments;
}