const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const router = express.Router();
const path = require("path");

const serviceAccountPath = path.join(__dirname, "..", "serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(require(serviceAccountPath)),
  });
}

const db = admin.firestore();

router.use(cors());
router.use(express.json());

router.post("/", async (req, res) => {
  try {
    const { ph_air, suhu_air, tds, tinggi_air, turbidity, timestamp } = req.body;

    if (
      ph_air == null ||
      suhu_air == null ||
      tds == null ||
      tinggi_air == null ||
      !turbidity ||
      !timestamp
    ) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    await db.collection("history").add({
      ph_air: Number(ph_air),
      suhu_air: Number(suhu_air),
      tds: Number(tds),
      tinggi_air: Number(tinggi_air),
      turbidity,
      timestamp: new Date(timestamp),
    });

    res.status(200).json({ success: true, message: "Data berhasil dikirim ke Firestore" });
  } catch (error) {
    console.error("Error kirim data:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
