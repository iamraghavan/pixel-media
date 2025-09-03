
import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('media'), (req, res) => {
  // Basic validation
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  
  console.log('Uploaded file:', req.file);
  
  res.status(200).json({ 
    message: 'File uploaded successfully', 
    filename: req.file.filename 
  });
});

export default router;
