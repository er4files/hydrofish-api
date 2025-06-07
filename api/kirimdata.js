const admin = require("firebase-admin");

let appInitialized = false;

if (!appInitialized) {
  const serviceAccount = require("../serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

  appInitialized = true;
}

const db = admin.firestore();

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Metode hanya POST yang diperbolehkan" });
  }

  try {
    const {
      ph_air,
      suhu_air,
      tds,
      timestamp,
      tinggi_air,
      turbidity
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

    return res.status(200).json({ success: true, message: "Data berhasil dikirim ke Firestore" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
