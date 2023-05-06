const express = require("express");
const router = express.Router();

router.post("/kirjaudu", async (req, res) => {
  const {password} = req.body;
  const salasana = 'salasana';
  
  // Tarkista käyttäjän syöttämät tiedot tässä
  // Jos tiedot ovat oikein, palauta vastauskoodi 200
  if (password === `${salasana}`) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
