const express = require("express");
const path = require("path");
const { spawn } = require("child_process");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

app.post("/predict", (req, res) => {
  const { cid1, cid2 } = req.body;
  const py = spawn("python", ["predict.py", cid1, cid2]);

  let result = "";
  py.stdout.on("data", (data) => (result += data.toString()));
  py.stderr.on("data", (err) => console.error("Python error:", err.toString()));
  py.on("close", () => {
    try {
      res.json(JSON.parse(result));
    } catch {
      res.status(500).json({ error: "Failed to parse prediction result" });
    }
  });
});

app.listen(5000, () => {
  console.log("✅ Node server running at http://localhost:5000");
});
