const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({ storage });

module.exports = (req, res, next) => {
  try {
    console.log('Upload middleware is being used'); // Log that the middleware is being accessed
    upload.single('pdf')(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Handle multer errors, e.g., file size exceeds limit
        console.error('Multer error:', err); // Log the multer error
        return res.status(400).json({ error: 'File upload failed' });
      }
      
      // Handle other unexpected errors
      if (err) {
        console.error('Unexpected error:', err); // Log the unexpected error
        return res.status(500).json({ error: 'Internal server error' });
      }

      // No error occurred, continue to the next middleware or route
      console.log('Middleware: File uploaded successfully'); // Log that the file was uploaded successfully
      next();
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error:', error); // Log the unexpected error
    return res.status(500).json({ error: 'Internal server error' });
  }
};
