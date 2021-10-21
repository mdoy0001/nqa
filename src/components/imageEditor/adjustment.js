import Color from 'color';

const sharp = require('sharp');

/* Expects imgBuffer to be a png file, returns a png file */
export const applyAdjustments = async (
  adjustments,
  imgBuffer,
  width
) => {
  var chain = sharp(imgBuffer);

  if (width !== undefined)
  {
    chain = chain.resize({width: width});
  }

  chain = chain.modulate({
    brightness: ((adjustments.exposureEnabled ? adjustments.exposure : 0.0) / 100.0 + 1),
    saturation: ((adjustments.enhanceEnabled ? adjustments.saturation : 50.0) / 50.0),
    lightness: ((adjustments.exposureEnabled ? adjustments.brightness : 50.0) - 50.0)
  });
  
  chain = chain.adjustContrast(
    adjustments.enhanceEnabled ? adjustments.contrast / 50.0 - 1 : undefined,
    adjustments.exposureEnabled ? adjustments.blackpoint / 50.0 - 1 : undefined,
    adjustments.exposureEnabled ? adjustments.recovery / 50.0 - 1 : undefined);

  if (adjustments.tonesEnabled)
  {
    chain = chain.adjustTones(
      (adjustments.shadows - 50.0) / 50.0,
      (adjustments.highlights - 50.0) / 50.0,
      (adjustments.midtones - 50.0) / 50.0,
    );
  }

  if (adjustments.whiteBalanceEnabled)
  {
    chain = chain.adjustTemperature(
      (adjustments.colorTemp - 50.0) / 50.0
    );
  }    

  if (adjustments.definition !== 0.0) {
    chain = chain.sharpen(adjustments.definition / 100.0);
  }

  chain = chain.plotHistogram();

  const b64 = await chain
    .plotHistogram()
    .png()
    .base64()
    .toBuffer({ resolveWithObject: true });

  return b64;
}

export const getImageBuffer = async (
  filePath
) => {
  const buf = await sharp(filePath)
  .png()
  .toBuffer({ resolveWithObject: true });

  return buf;
}