require("dotenv").config(); // 🔥 REQUIRED

const mongoose = require("mongoose");
const Candidate = require("../models/Candidate");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected for seeding");
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

async function seed() {
  try {
    await Candidate.deleteMany();

    await Candidate.create([
      {
        name: "Sarah Mitchell",
        party: "Product Team",
      },
      {
        name: "James Chen",
        party: "Engineering Team",
      },
    ]);

    console.log("✅ Candidates seeded successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();