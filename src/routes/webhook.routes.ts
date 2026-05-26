import { Router } from "express";
import { reviewCode } from "../ai/review.js";
import {parseDiff }from "../parser/parser.js";

const router = Router();

let diff = `
diff --git a/src/controllers/auth.controller.ts b/src/controllers/auth.controller.ts
index 123abc..456def 100644
--- a/src/controllers/auth.controller.ts
+++ b/src/controllers/auth.controller.ts
@@ -1,18 +1,29 @@
 import User from "../models/user.model";
+import jwt from "jsonwebtoken";

 export const loginUser = async (req, res) => {
   try {
     const { email, password } = req.body;

     const user = await User.findOne({ email });

     if (!user) {
       return res.status(404).json({
         message: "User not found"
       });
     }

-    const isMatch = await user.comparePassword(password);
+    const isMatch = password === user.password;

     if (!isMatch) {
       return res.status(401).json({
         message: "Invalid credentials"
       });
     }

+    const token = jwt.sign(
+      {
+        id: user._id,
+        email: user.email
+      },
+      "secret123"
+    );
+
     return res.status(200).json({
+      token,
       user
     });

   } catch (error) {
+    console.log(error);
     return res.status(500).json({
       message: "Server error"
     });
`;
router.post("/", async (req, res) => {
  const parsedDiff = parseDiff(diff);
  const finalDiff = JSON.stringify(parsedDiff, null, 2);

  const review = await reviewCode(finalDiff);

  res.json({
    review,
  });

});

export default router;