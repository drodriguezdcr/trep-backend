require('dotenv').config();
const express = require("express");
const jwt = require("jsonwebtoken");
const { conn } = require("./dbconnect.js");
const bcrypt = require("bcrypt");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//Token verification middleware


router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  var sql = "SELECT user_id, first_name, password FROM users WHERE email = ?";
  conn.query(sql, [email], async function (err, results, fields) {
    if (err) throw err;
    if(results.length > 0){
      hashedPass = results[0].password;
      console.log(results);
      const match = await bcrypt.compareSync(password, hashedPass);
      if(match){
        const user_id = results[0].user_id;
        var token = jwt.sign({ user_id : user_id }, process.env.SECRET_JWT_KEY);
        console.log(token);
        return res.json({ success: true, token : token, msg : "You've been successfully logged in!", firstName: results[0].first_name });
      }
    }
    //
    return res.json({ success: false, token: null, msg : "These login details were incorrect, please try again." });
  });

});


module.exports = router;
