const express = require("express");
const router = express.Router();
const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const auth = require("../middleware/auth");
const {
  controllers: { postInvite, postAccept, postReject },
} = require("../controller/friendInvitation/friendInvitaionControllers");

const postFriendInvitationSchema = Joi.object({
  targetMailAddress: Joi.string().email(),
});

const inviteDecisionSchema = Joi.object({
  id: Joi.string().required(),
});

router.post(
  "/invite",
  auth,
  validator.body(postFriendInvitationSchema),
  postInvite
);

router.post("/accept", auth, validator.body(inviteDecisionSchema), postAccept);
router.post("/reject", auth, validator.body(inviteDecisionSchema), postReject);

module.exports = router;
