import { Router } from "express";
import { asyncHandler } from "../async.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const router = Router();
let userDB = {
  secret: null,
  is2FAEnabled: false,
};

router.get(
  "/generate",
  asyncHandler(async (req, res) => {
    const secret = speakeasy.generateSecret({
      length: 20,
      name: "MyApp (tanveer@example.com)",
    });
    console.log(secret);
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    userDB.secret = secret.base32;
    // console.log(qrCode);
    res.send(`
        <html>
            <body>
                <h2>Scan QR Code</h2>
                <img src="${qrCode}" />
            </body>
        </html>
    `);
    // res.json({
    //   secret: secret.base32,
    //   qrCode: qrCode,
    // });
  }),
);

router.post(
  "/verify",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const token = req.body.token;

    console.log(userDB);

    const verified = speakeasy.totp.verify({
      secret: userDB.secret,
      encoding: "base32",
      token: token,
      window: 1, // allows ±30 sec tolerance
    });
    console.log(verified);

    if (verified) {
      userDB.is2FAEnabled = true;
      return res.json({ success: true, message: "OTP valid ✅" });
    } else {
      return res.json({ success: false, message: "OTP invalid/expired ❌" });
    }
  }),
);

export default router;
