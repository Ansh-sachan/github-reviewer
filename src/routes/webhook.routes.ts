import { Router } from "express";
import parse from "parse-diff";

import { reviewCode } from "../ai/review.js";
import { getPullRequestFiles } from "../github/github.service.js";

const router = Router();

/**
 * Convert parsed diff into AI-friendly format
 */
function formatDiffForAI(parsedFiles: any[]) {

  return parsedFiles.map((file) => {

    const chunks = file.chunks || [];

    const changes: string[] = [];

    for (const chunk of chunks) {

      for (const change of chunk.changes) {

        if (change.add) {
          changes.push(`ADDED: ${change.content}`);
        }

        else if (change.del) {
          changes.push(`REMOVED: ${change.content}`);
        }
      }
    }

    return `
====================================
FILE: ${file.to || file.from}
====================================

${changes.join("\n")}
`;
  }).join("\n");
}

/**
 * Test route
 */
router.post("/", async (req, res) => {

  try {

    const diff = `
diff --git a/src/controllers/auth.controller.ts b/src/controllers/auth.controller.ts
index 123abc..456def 100644
--- a/src/controllers/auth.controller.ts
+++ b/src/controllers/auth.controller.ts
@@ -1,18 +1,29 @@

-const isMatch = await user.comparePassword(password);
+const isMatch = password === user.password;

+const token = jwt.sign(
+ {
+   id: user._id,
+   email: user.email
+ },
+ "secret123"
+);
`;

    const parsed = parse(diff);

    const formattedDiff =
      formatDiffForAI(parsed);

    console.log(formattedDiff);

    const review =
      await reviewCode(formattedDiff);

    res.json({
      formattedDiff,
      review
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Review failed"
    });
  }
});

/**
 * Real GitHub PR review route
 */
router.get(
  "/pull-request-files",
  async (req, res) => {

    try {

      const githubFiles =
        await getPullRequestFiles(
          "facebook",
          "react",
          36557
        );

      /**
       * Filter reviewable files
       */
      const reviewableFiles =
        githubFiles.filter(file =>

          file.patch &&

          !file.filename.includes(
            "package-lock"
          ) &&

          !file.filename.includes(
            ".min."
          ) &&

          file.status !== "removed"
        );

      const reviews = [];

      /**
       * Review files one by one
       */
      for (const file of reviewableFiles) {

        try {

          const rawPatch =
            file.patch;

          /**
           * Parse patch
           */
          const parsedPatch =
            parse(rawPatch);

          /**
           * Convert to AI-friendly format
           */
          const formattedDiff =
            formatDiffForAI(
              parsedPatch
            );

          console.log(
            `\n Reviewing: ${file.filename}`
          );

          /**
           * Send to LLM
           */
          const review =
            await reviewCode(
              file.filename,
              formattedDiff
            );

          reviews.push({
            file: file.filename,
            review
          });

        } catch (fileError) {

          console.error(
            `Error reviewing ${file.filename}`,
            fileError
          );

          reviews.push({
            file: file.filename,
            error: "Review failed"
          });
        }
      }

      res.json({
        totalFiles: reviewableFiles.length,
        reviews
      });

    } catch (error) {

      console.error(
        "Error fetching pull request files:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching pull request files"
      });
    }
  }
);

export default router;