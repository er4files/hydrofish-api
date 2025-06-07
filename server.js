const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Endpoint kirim data sensor air
app.post("/api/kirimdata", async (req, res) => {
  try {
    console.log("Data diterima:", req.body);

    const {
      ph_air,
      suhu_air,
      tds,
      timestamp,
      tinggi_air,
      turbidity
    } = req.body;

    // Validasi timestamp saja
    if (!timestamp) {
      return res.status(400).json({
        success: false,
        message: "Field 'timestamp' wajib diisi"
      });
    }

    await db.collection("history").add({
      ph_air: Number(ph_air),
      suhu_air: Number(suhu_air),
      tds: Number(tds),
      timestamp: new Date(timestamp),
      tinggi_air: Number(tinggi_air),
      turbidity
    });

    return res.status(200).json({
      success: true,
      message: "Data berhasil dikirim ke Firestore"
    });
  } catch (error) {
    console.error("Error mengirim data:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
