const cron = require("node-cron");
const path = require("path");
const { PrismaClient, userType, artStatus } = require("@prisma/client");
const { spawn } = require("child_process");
const sendEmail = require("../email/sendEmail");

const prisma = new PrismaClient();

const runCheckPDF = async () => {
  try {
    const pendingArtist = await prisma.user.findFirst({
      where: {
        isBlocked: false,
        isVerifiedArtist: false,
        type: userType.ARTIST,
      },
    });

    if (!pendingArtist || !pendingArtist.files) {
      console.log("No pending artist or no file found.");
      return;
    }

    const fileName = pendingArtist.files.replace(/["\\]/g, "");
    const filePath = path.join(__dirname, "../Files", fileName);
    const date = pendingArtist.createdAt.toISOString().split("T")[0];

    const pythonPath = path.join(
      __dirname,
      "../python/venv/Scripts/python.exe"
    );
    const scriptPath = path.join(__dirname, "../python/CheckPDF.py");

    const pyProcess = spawn(pythonPath, [scriptPath, filePath, date]);

    let result = "";

    pyProcess.stdout.on("data", (data) => {
      result += data.toString().trim();
    });

    pyProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pyProcess.on("close", async (code) => {
      const isDuplicate = result.toLowerCase() === "true";
      console.log(`Duplicate status: ${isDuplicate}`);

      if (isDuplicate) {
        // Update user block status
        await prisma.user.update({
          where: { userid: pendingArtist.userid },
          data: { isBlocked: true, isVerifiedArtist: false },
        });
        // Send email notification
        await sendEmail({
          email: pendingArtist.email,
          subject: "Duplicate Art Submission Detected",
          payload: `Dear ${pendingArtist.name},\n\nOur system has detected that your submitted portfolio contains duplicate content. Please revise your submission.\n\nRegards,\nTeam`,
        });

        console.log(
          `User ${pendingArtist.email} has been blocked due to duplication.`
        );
      } else {
        await prisma.user.update({
          where: { userid: pendingArtist.userid },
          data: { isBlocked: false, isVerifiedArtist: true },
        });
        console.log(`No duplicates found for ${pendingArtist.email}`);
        await sendEmail({
          email: pendingArtist.email,
          subject: "Congratulations",
          payload: `Dear ${pendingArtist.name},\n\n Your account has been approved please logout and login again.\n\nRegards,\nTeam`,
        });
      }

      console.log(`Python script finished with code ${code}`);
    });
  } catch (err) {
    console.error("Cron job error:", err);
  }
};

const runCheckArts = async () => {
  try {
    const pendingArts = await prisma.arts.findFirst({
      where: {
        status: artStatus.DRAFT,
      },
      include: {
        user: true,
      },
    });

    console.log("pendingArts", pendingArts);

    if (!pendingArts) {
      console.log("No pending artist or no file found.");
      return;
    }

    // Get all existing approved arts except the current one
    const existingArts = await prisma.arts.findMany({
      where: {
        in: [artStatus.LIVE, artStatus.SOLD],
        id: {
          not: pendingArts.id,
        },
      },
    });

    const artPath = path.join(__dirname, "../Arts", pendingArts.image);
    const existingArtPaths = existingArts.map((art) =>
      path.join(__dirname, "../Arts", art.image)
    );

    // Convert array to comma-separated string for Python
    const existingArtPathsStr = JSON.stringify(existingArtPaths);

    return new Promise((resolve, reject) => {
      const pythonProcess = spawn("python", [
        path.join(__dirname, "../python/CheckArts.py"),
        artPath,
        existingArtPathsStr,
      ]);

      let result = "";
      let error = "";

      pythonProcess.stdout.on("data", (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        error += data.toString();
      });

      pythonProcess.on("close", async (code) => {
        if (code !== 0) {
          console.error("Python script error:", error);
          reject(new Error("Python script failed"));
          return;
        }

        try {
          const { isDuplicate, message } = JSON.parse(result);

          // Update the art status based on duplication check
          await prisma.arts.update({
            where: {
              id: pendingArts.id,
            },
            data: {
              status: isDuplicate ? artStatus.REJECTED : artStatus.LIVE,
            },
          });

          if (isDuplicate) {
            await sendEmail({
              email: pendingArts.user.email,
              subject: "Duplicate Art Submission Detected",
              payload: `Dear ${pendingArts.user.username},\n\nOur system has detected that your submitted art contains duplicate content. Please revise your submission.\n\nRegards,\nTeam`,
            });
          }
          if (!isDuplicate) {
            await sendEmail({
              email: pendingArts.user.email,
              subject: "Art Approved",
              payload: `Dear ${pendingArts.user.username},\n\nYour art has been approved.\n\nRegards,\nTeam`,
            });
          }

          resolve({ isDuplicate, message });
        } catch (err) {
          console.error("Error parsing Python result:", err);
          reject(err);
        }
      });
    });
  } catch (err) {
    console.error("Cron job error:", err);
    throw err;
  }
};

// Run every minute
// cron.schedule("*/1 * * * *", () => {
//   console.log("Running PDF duplicate check...");
//   runCheckPDF();
// });

//Run every 10 minutes
// cron.schedule("*/1 * * * *", () => {
//   console.log("Running art duplicate check...");
//   runCheckArts();
// });
