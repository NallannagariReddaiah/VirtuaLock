import multer from 'multer';

// Configure storage (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
