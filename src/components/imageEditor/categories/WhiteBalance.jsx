import React, { useContext } from "react";
import { AdjustmentCategory, InputSlider } from "./AdjustmentCategory";
import { AdjustmentsContext } from "../../../pages/workspace";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../../../slices/adjustments";
import { saveAdjustments } from "../../../util/filesystem";


export function WhiteBalance() {
  const colorTemp = useSelector((state) => state.adjustments.colorTemp);
  const tint = useSelector((state) => state.adjustments.tint);

  const dispatch = useDispatch();

  const adjustments = useSelector(state => state.adjustments);
  const selected = useSelector(state => state.filesystem.primaryFile);

  const checked = useSelector(state => state.adjustments.whiteBalanceEnabled);

  const valid = (val, org) => selected !== undefined && selected !== '' && val !== org;
  const save = (val, org, newAdjustments) => { if (valid(val, org)) saveAdjustments([selected], newAdjustments); }


  
  return (
    <AdjustmentCategory
      label="White Balance"
      checked={checked}
      setValue={val => {dispatch(actions.setWhiteBalanceEnabled(val)); saveAdjustments([selected], {...adjustments, whiteBalanceEnabled: val});}}
      categoryValue="whiteBalanceEnabled"
    >
      <InputSlider label="Temp" value={colorTemp} sliderStyle={{
        '& .MuiSlider-track': {
          background: 'none',
        },
        '& .MuiSlider-rail': {
          opacity: 1.0,
          backgroundImage: 'linear-gradient(to right, #FF6C00, #FFB779, #FFD7B7, #FFFFFF, #DBE4FF, #CBDBFF, #C1D5FF)'
        }
      }} onChange={val => {
        dispatch(actions.setColorTemp(val));
        save(val, colorTemp, {...adjustments, colorTemp: val});
      }}></InputSlider>
      {/* <InputSlider label="Tint" value={tint} onChange={val => {
        dispatch(actions.setTint(val));
        save(val, tint, {...adjustments, tint: val});
      }}></InputSlider> */}
    </AdjustmentCategory>
  );
}
