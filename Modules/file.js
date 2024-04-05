const fs = require("fs").promises;
const path = require("path");
const mime = require("mime-types");
const multer = require("multer");
const { PDFDocument, PDFPage } = require("pdf-lib");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userName = req.user.username;
    const userUploadsDir = `./uploads/${userName}`;

    // Check if uploads directory exists, if not, create it
    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    // Create user's directory if it doesn't exist
    if (!fs.existsSync(userUploadsDir)) {
      fs.mkdirSync(userUploadsDir);
    }

    cb(null, userUploadsDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports.fileUpload = async (req, res) => {
  try {
    upload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({ error: "Upload error" });
      } else if (err) {
        // An unknown error occurred when uploading.
        return res.status(500).json({ error: "Something went wrong" });
      }

      // Check if no file is uploaded
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      const fileType = req.file.mimetype;

      // Get the MIME type of the file.
      // const mimeType = mime.lookup(fileType);

      // Check if the MIME type is application/pdf.
      if (fileType === "application/pdf") {
        console.log("file is pdf");
        return res.json({
          message: "file uploaded successfully",
        });
      } else {
        // Delete the uploaded file if it's not a PDF
        // fs.unlinkSync(fileType);
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          error: "File uploaded is not a PDF",
        });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

module.exports.getFile = async (req, res) => {
  try {
    const userName = req.user.username;
    const filename = req.query.filename;
    const filePath = `./uploads/${userName}/${filename}`;
    if (fs.existsSync(filePath)) {
      res.setHeader("Content-Type", "application/pdf");
      // Stream the file to the response
      fs.createReadStream(filePath).pipe(res);
    } else {
      // If file doesn't exist, send 404 error
      res.status(404).send("File not found");
    }
  } catch (error) {
    // If any error occurs during file retrieval or response sending, handle it
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
};

// Function to extract specific pages from a PDF
async function extractPages(inputDoc, pages, outputFilePath) {
  const newPdfDoc = await PDFDocument.create();

  for (const pageIndex of pages) {
    const adjustedIndex = pageIndex - 1;
    const page = inputDoc.getPage(adjustedIndex);
    if (page) {
      const [copiedPage] = await newPdfDoc.copyPages(inputDoc, [adjustedIndex]);
      newPdfDoc.addPage(copiedPage); // Add the copied page to the new document
    } else {
      console.log(`Page index ${pageIndex} is out of range`);
    }
  }

  const newPdfBytes = await newPdfDoc.save();
  await fs.writeFile(outputFilePath, newPdfBytes);
}




// Example usage
module.exports.fileExtract = async (req, res) => {
  try {
    const { filename, pages } = req.body;
    const username = req.user.username;
    const inputFilePath = `./uploads/${username}/${filename}`;
    const outputPath = `${inputFilePath}_extracted.pdf`;

    console.log("Fetching PDF file...");
    const inputDoc = await fetchPdfFile(inputFilePath);
    console.log("PDF file fetched successfully.");

    console.log("Extracting pages...");
    await extractPages(inputDoc, pages, outputPath);
    console.log("Pages extracted successfully.");

    return res.json({ success: true, outputPath });
  } catch (err) {
    console.error("Error extracting PDF pages:", err);
    res
      .status(500)
      .json({ success: false, error: "Error extracting PDF pages" });
  }
};

async function fetchPdfFile(filePath) {
  console.log("Reading PDF file...");
  const pdfBytes = await fs.readFile(filePath);
  console.log("PDF file read successfully.");
  console.log("Loading PDF document...");
  const pdfDoc = await PDFDocument.load(pdfBytes);
  console.log("PDF document loaded successfully.");
  return pdfDoc;
}
