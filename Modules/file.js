const multer = require("multer");
const fileUploader = require("../Models/filesave");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10 // 10MB
  },
  fileFilter: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)) {
      return cb(new Error('Only image and pdf files are allowed!'));
    }
    cb(null, true);
  }
});

module.exports.fileUpload = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      upload.single("file")(req, res, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    } else {
      const fileName = req.file.filename;
      const filePath = req.file.path;
      const uploadTime = new Date();

      await fileUploader.dbStore(fileName, filePath, uploadTime);

      return res.json({
        message: "File uploaded successfully",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};
