import express from "express";

const router = express.Router();

router.post("/alert", (req, res) => {
  console.log("🚨 ALERT RECEIVED:");
  console.log(JSON.stringify(req.body, null, 2));

  res.status(200).send("Alert received");
});

export default router;