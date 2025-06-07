require("dotenv").config();
const express = require("express");
const app = express();

const kirimDataRoute = require("./api/kirimdata");

app.use("/api/kirim-hydrofish", kirimDataRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
