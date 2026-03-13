import { env } from "../config/env";

// For development without Resend, log codes to console
const isDevelopment = env.NODE_ENV === "development";
const hasResendKey = !!env.RESEND_API_KEY;

/**
 * Send email with verification code
 * Uses Resend in production, or logs to console in development
 */
export async function sendVerificationCode(email: string, code: string): Promise<void> {
  if (!hasResendKey) {
    if (isDevelopment) {
      console.log(`📧 [DEV MODE] Verification code for ${email}: ${code}`);
      return;
    }
    throw new Error("Email service not configured. Set RESEND_API_KEY in .env");
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(env.RESEND_API_KEY);

    await resend.emails.send({
      from: env.EMAIL_FROM || "noreply@resend.dev",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your Verification Code</h2>
          <p>Use this code to sign in to your account:</p>
          <div style="
            background-color: #f0f0f0; 
            padding: 20px; 
            border-radius: 8px; 
            text-align: center;
            margin: 20px 0;
          ">
            <span style="
              font-size: 32px; 
              font-weight: bold; 
              letter-spacing: 8px;
              color: #333;
            ">${code}</span>
          </div>
          <p style="color: #666; font-size: 14px;">
            This code expires in 15 minutes. If you didn't request this code, you can ignore this email.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send verification code");
  }
}

/**
 * Generate a random 6-digit code
 */
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
