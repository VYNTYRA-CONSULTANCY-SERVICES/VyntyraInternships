import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  collegeName: { type: String, required: true },
  collegeLocation: { type: String, required: true },
  preferredDomain: { type: String, required: true },
  languages: { type: String, required: true },
  remoteComfort: { type: String, required: true },
  placementContact: { type: String, required: true },
  resumePath: { type: String },
  consent: { type: Boolean, default: true },
  createdAt: { type: Date, default: () => new Date() },
});

const Application = mongoose.model("Application", applicationSchema);

export default Application;
