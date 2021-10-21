import React, { useContext } from "react";
import { AdjustmentCategory, InputSlider } from "./AdjustmentCategory";
import { AdjustmentsContext } from "../../../pages/workspace";
import { useDispatch, useSelector } from "react-redux";

import { actions } from "../../../slices/adjustments";
import { saveAdjustments } from "../../../util/filesystem";

export function Enhance() {
  const contrast = useSelector((state) => state.adjustments.contrast);
  const definition = useSelector((state) => state.adjustments.definition);
  const saturation = useSelector((state) => state.adjustments.saturation);
  const vibrancy = useSelector((state) => state.adjustments.vibrancy); 

  const dispatch = useDispatch();

  const adjustments = useSelector(state => state.adjustments);
  const selected = useSelector(state => state.filesystem.primaryFile);

  const checked = useSelector(state => state.adjustments.enhanceEnabled);

  const valid = (val, org) => selected !== undefined && selected !== '' && val !== org;
  const save = (val, org, newAdjustments) => { if (valid(val, org)) saveAdjustments([selected], newAdjustments); }

  return (
    <AdjustmentCategory label="Enhance" categoryValue="enhanceEnabled"
      checked={checked}
      setValue={val => { dispatch(actions.setEnhanceEnabled(val)); saveAdjustments([selected], {...adjustments, enhanceEnabled: val}); }}
      >
      
      <InputSlider label={"Contrast"} value={contrast} onChange={val => {
        dispatch(actions.setContrast(val));
        save(val, contrast, {...adjustments, contrast: val});
      }} />

      <InputSlider label={"Definition"} value={definition} onChange={val => {
        dispatch(actions.setDefinition(val));
        save(val, definition, {...adjustments, definition: val});
      }} />

      <InputSlider label={"Saturation"} value={saturation} onChange={val => {
        dispatch(actions.setSaturation(val));
        save(val, saturation, {...adjustments, saturation: val});
      }} />

      <InputSlider label={"Vibrancy"} value={vibrancy} onChange={val => {
        dispatch(actions.setVibrancy(val));
        save(val, vibrancy, {...adjustments, vibrancy: val});
      }} />

    </AdjustmentCategory>
  );
}
