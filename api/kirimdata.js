const admin = require("firebase-admin");

const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

function formatTanggalUTC(timeString) {
  const date = new Date(timeString);
  const tgl = String(date.getUTCDate()).padStart(2, "0");
  const bln = String(date.getUTCMonth() + 1).padStart(2, "0");
  const thn = date.getUTCFullYear();
  const jam = String(date.getUTCHours()).padStart(2, "0");
  const menit = String(date.getUTCMinutes()).padStart(2, "0");
  return `${tgl}/${bln}/${thn} . ${jam}:${menit}`;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method Not Allowed" });
  }

  try {
    const { ph_air, suhu_air, tds, timestamp, tinggi_air, turbidity } = req.body;

    if (
      ph_air === undefined ||
      suhu_air === undefined ||
      tds === undefined ||
      !timestamp ||
      tinggi_air === undefined ||
      !turbidity
    ) {
      return res.status(400).json({ success: false, message: "Data tidak lengkap" });
    }

    const formattedTime = formatTanggalUTC(timestamp);

    await db.collection("history").add({
      ph_air,
      suhu_air,
      tds,
      timestamp: formattedTime,
      tinggi_air,
      turbidity,
    });

    return res.status(200).json({ success: true, message: "Data berhasil dikirim ke Firestore" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
