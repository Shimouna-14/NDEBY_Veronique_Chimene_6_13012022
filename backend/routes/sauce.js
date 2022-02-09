const express = require("express");
const router = express.Router();
const saucesCtrl = require("../controllers/sauce")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer")

router.get("/", auth,  saucesCtrl.allSauces);
router.get("/:id", auth, saucesCtrl.oneSauce);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.likeSauce);

module.exports = router;