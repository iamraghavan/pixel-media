
import mediaService from '../services/media.js';

const upload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.status(201).json({ filename: req.file.filename });
};

const transform = async (req, res, next) => {
  try {
    const { filename, transformations } = req.params;
    const image = await mediaService.transformImage(filename, transformations);
    res.set('Content-Type', 'image/png');
    image.pipe(res);
  } catch (err) {
    next(err);
  }
};

export default { upload, transform };
