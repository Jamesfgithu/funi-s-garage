import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jamesf1972@gmail.com",
      pass: "hojx wmst kjqe akua", // Updated Gmail App Password
    },
  });
  const mailOptions = {
    from: 'Funi\'s Garage <jamesf1972@gmail.com>',
    to: "7168015915@vtext.com", // Testing: send to your number
    subject: "Funi's Garage Visitor",
    text: "Hi Anthony. This is your dad, I love you. Someone visited Funi's Garage!",
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log("Notification sent to your Verizon SMS");
    return res.status(200).json({ success: true });
  } catch (e) {
    console.log("Email send error:", e);
    return res.status(500).json({ error: "Failed to send notification" });
  }
}
