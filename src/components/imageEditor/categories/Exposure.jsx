import React, { useContext } from "react";
import { AdjustmentCategory, InputSlider } from "./AdjustmentCategory";
import { AdjustmentsContext } from "../../../pages/workspace";

import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../../slices/adjustments";
import { saveAdjustments } from "../../../util/filesystem";

export function Exposure() {
  const exposure = useSelector((state) => state.adjustments.exposure);
  const recovery = useSelector((state) => state.adjustments.recovery);
  const blackpoint = useSelector((state) => state.adjustments.blackpoint);
  const brightness = useSelector((state) => state.adjustments.brightness);

  const dispatch = useDispatch();

  const adjustments = useSelector(state => state.adjustments);
  const selected = useSelector(state => state.filesystem.primaryFile);

  const checked = useSelector(state => state.adjustments.exposureEnabled);

  const valid = (val, org) => selected !== undefined && selected !== '' && val !== org;
  const save = (val, org, newAdjustments) => { if (valid(val, org)) saveAdjustments([selected], newAdjustments); }

  return (
    <AdjustmentCategory label="Exposure" categoryValue="exposureEnabled"
      checked={checked}
      setValue={val => {dispatch(actions.setExposureEnabled(val)); saveAdjustments([selected], {...adjustments, exposureEnabled: val});}}
      >
      <InputSlider label={"Exposure"} value={exposure} onChange={val => {
        dispatch(actions.setExposure(val));
        save(val, exposure, {...adjustments, exposure: val});
      }} />

      <InputSlider label={"Recovery"} value={recovery} onChange={val => {
        dispatch(actions.setRecovery(val));
        save(val, recovery, {...adjustments, recovery: val});
      }} />

      <InputSlider label={"Black Point"} value={blackpoint} onChange={val => {
        dispatch(actions.setBlackpoint(val));
        save(val, blackpoint, {...adjustments, blackpoint: val});
      }} />

      <InputSlider label={"Brightness"} value={brightness} onChange={val => {
        dispatch(actions.setBrightness(val));
        save(val, brightness, {...adjustments, brightness: val});
      }} />
    </AdjustmentCategory>
  );
}
