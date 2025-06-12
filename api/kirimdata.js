const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// 🚀 Endpoint untuk mengirim data
app.post("/api/kirimdata", async (req, res) => {
  try {
    const {
      ph_air, suhu_air, tds, timestamp, tinggi_air, turbidity
    } = req.body;

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
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Endpoint GET untuk membaca semua data dari Firestore
app.get("/api/sensordata", async (req, res) => {
  try {
    const snapshot = await db.collection("history").orderBy("timestamp", "desc").get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ❌ Endpoint DELETE untuk menghapus data berdasarkan ID dokumen
app.delete("/api/sensordata/:id", async (req, res) => {
  const docId = req.params.id;

  try {
    await db.collection("history").doc(docId).delete();
    res.status(200).json({ success: true, message: `Data ${docId} berhasil dihapus` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Jalankan server lokal (untuk testing lokal, vercel akan ignore ini saat deploy)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
