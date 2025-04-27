// app/api/upload/route.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parser to handle multipart form data
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads');

const handler = (req, res) => {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Error during file upload' });
        return;
      }

      const filePath = `/uploads/${files.image[0].newFilename}`;
      res.status(200).json({ filePath });
    });
  } else {
    // For other HTTP methods like GET, PUT, DELETE
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
