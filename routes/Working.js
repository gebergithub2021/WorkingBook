const express=require("express");
const router = express.Router();

const Working = require('../controllers/WorkingController');

router.post('/',Working.AddWord);
router.get('/:word_id',Working.Get);
router.get('/',Working.GetAll);
router.put("/:word_id", Working.Update);
router.delete("/:word_id", Working.Delete);

module.exports=router;