import React, { useContext } from "react";
import { AdjustmentCategory, InputSlider } from "./AdjustmentCategory";
import { AdjustmentsContext } from "../../../pages/workspace";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../../slices/adjustments";
import { saveAdjustments } from "../../../util/filesystem";

export function Highlights()
{
  const highlights = useSelector((state) => state.adjustments.highlights);
  const shadows = useSelector((state) => state.adjustments.shadows);
  const midtones = useSelector((state) => state.adjustments.midtones);

  const dispatch = useDispatch();

  const adjustments = useSelector(state => state.adjustments);
  const selected = useSelector(state => state.filesystem.primaryFile);

  const checked = useSelector(state => state.adjustments.tonesEnabled);

  const valid = (val, org) => selected !== undefined && selected !== '' && val !== org;
  const save = (val, org, newAdjustments) => { if (valid(val, org)) saveAdjustments([selected], newAdjustments); }

  return <AdjustmentCategory label="Highlights &amp; Shadows" categoryValue="highlightsEnabled"
      checked={checked}
      setValue={val => {dispatch(actions.setTonesEnabled(val)); saveAdjustments([selected], {...adjustments, tonesEnabled: val});}}
      >
    <InputSlider label={"Highlights"} value={highlights} onChange={val => {
      dispatch(actions.setHighlights(val));
      save(val, highlights, {...adjustments, highlights: val});
    }} />

    <InputSlider label={"Shadows"} value={shadows} onChange={val => {
      dispatch(actions.setShadows(val));
      save(val, shadows, {...adjustments, shadows: val});
    }} />

    <InputSlider label={"Mid Contrast"} value={midtones} onChange={val => {
      dispatch(actions.setMidtones(val));
      save(val, midtones, {...adjustments, midtones: val});
    }} />
  </AdjustmentCategory>
}