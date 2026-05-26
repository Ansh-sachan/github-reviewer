import { Router } from "express";
import { reviewCode } from "../ai/review.js";

const router = Router();

router.post("/", async (req, res) => {
  const diff = `
- const password = req.body.password
+ const password = req.body.password
+ user.password = password
`;

  const review = await reviewCode(diff);

  res.json({
    review,
  });
});

export default router;