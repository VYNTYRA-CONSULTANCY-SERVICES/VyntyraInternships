import { Router } from "express";
import multer from "multer";
import fs from "node:fs";
import path from "path";

import Application from "../models/Application.js";

const router = Router();
const uploadDir = process.env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads");

const ensureUploadDir = () => {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    ensureUploadDir();
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
    cb(null, `${Date.now()}-${sanitized}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowed.includes(ext)) {
      const error = new Error("Resume must be a PDF or Word document.");
      error.statusCode = 400;
      return cb(error);
    }
    cb(null, true);
  },
});

const requiredFields = [
  "full_name",
  "phone",
  "email",
  "college_name",
  "college_location",
  "preferred_domain",
  "languages",
  "remote_comfort",
  "placement_contact",
];

router.post("/", upload.single("resume"), async (req, res, next) => {
  try {
    for (const field of requiredFields) {
      const value = String(req.body[field] ?? "").trim();
      if (!value) {
        return res.status(400).json({ message: `Missing submission data: ${field}` });
      }
    }

    if (!req.body.consent) {
      return res.status(400).json({ message: "You must consent to data processing before applying." });
    }

    const resumePath = req.file
      ? path.relative(process.cwd(), req.file.path).split(path.sep).join("/")
      : undefined;

    const document = {
      fullName: req.body.full_name.trim(),
      phone: req.body.phone.trim(),
      email: req.body.email.trim(),
      collegeName: req.body.college_name.trim(),
      collegeLocation: req.body.college_location.trim(),
      preferredDomain: req.body.preferred_domain.trim(),
      languages: req.body.languages.trim(),
      remoteComfort: req.body.remote_comfort.trim(),
      placementContact: req.body.placement_contact.trim(),
      resumePath,
      consent: true,
    };

    await Application.create(document);

    return res
      .status(201)
      .json({ message: "Thank you for applying. We will respond within five working days." });
  } catch (error) {
    next(error);
  }
});

export default router;
