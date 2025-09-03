
import sharp from 'sharp';
import path from 'path';

const transformImage = async (filename, transformations) => {
  const imagePath = path.resolve('public', filename);
  let image = sharp(imagePath);

  const ops = transformations.split(',');
  const options = {};

  ops.forEach(op => {
    const [key, value] = op.split('_');
    switch (key) {
      case 'w': options.width = parseInt(value); break;
      case 'h': options.height = parseInt(value); break;
      case 'c': options.fit = value; break;
      case 'g': options.gravity = value; break;
      case 'ar': 
        const [w, h] = value.split(':').map(Number);
        options.aspect = { ratio: w/h }; 
        break;
      case 'q': options.quality = parseInt(value); break;
      case 'e': 
        if(value === 'grayscale') image.grayscale();
        if(value === 'sepia') image.sepia();
        break;
      case 'r': image.composite([{ input: Buffer.from(`<svg><rect x="0" y="0" width="${options.width || 100}" height="${options.height || 100}" rx="${value}" ry="${value}"/></svg>`), blend: 'dest-in' }]); break;
      case 'bo': 
        const [width, color] = value.split('_');
        image.extend({top: parseInt(width), bottom: parseInt(width), left: parseInt(width), right: parseInt(width), background: `#${color}`});
        break;
    }
  });

  if (Object.keys(options).length > 0) {
    image.resize(options);
  }

  return image;
};

export default { transformImage };
