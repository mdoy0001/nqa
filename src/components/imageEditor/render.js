import { applyAdjustments, getImageBuffer } from "./adjustment";


const drawChannel = (ctx, channel, color, w, h) => {
  const histW = 100;
  const maxH = Math.max(...channel);

  const heightScale = h / maxH;
  const widthScale = w / histW;
  

  ctx.fillStyle = color;
  
  for (var i = 0; i < channel.length; i++)
  {
    const val = channel[i] * heightScale;

    ctx.fillRect(i * widthScale, h - val, widthScale, val);
  }
}

export const drawHistogram = async (hist, canvas, color) => {
  const {width, height} = canvas;

  if (canvas !== undefined)
  {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    drawChannel(ctx, hist, color, width, height); // luminance
  }
}


export const render = async (adjustments, img, canvas) => {

  const {width, height} = canvas;

  const res = await applyAdjustments(adjustments, img, width);

  const {data, info, hist} = res;


  const b64 = data;

  if (canvas !== undefined)
  {
    const img = new Image();
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      const aspectRatio = info.width / info.height;

      var destWidth, destHeight;
      var dx, dy;

      // info.width should equal width. Therefore we need to know if we need to scale the height up or down.

      // if we're scaling up, we'll also need to scale the width down to preserve the aspect ratio.

      if (aspectRatio < 1)
      {
        // The height is greater than the width. Hence, we want to find the greatest width that the height will fit in the canvas for while preserving the aspect ratio.

        const scaleFactor = height / info.height; // should be less than 1.

        destWidth = info.width * scaleFactor;
        destHeight = info.height;

        dy = 0;
        dx = (width - destWidth) / 2.0;
      }
      else
      {
        destWidth = info.width;
        destHeight = info.height;

        dy = (height - destHeight) / 2.0;
        dx = 0;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, info.width, info.height, dx, dy, destWidth, destHeight);
    }
    img.src = b64;
  }

  return hist;
}