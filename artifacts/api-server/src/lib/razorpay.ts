import Razorpay from "razorpay";
import crypto from "node:crypto";

let cachedClient: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (cachedClient) return cachedClient;
  const key_id = process.env["RAZORPAY_KEY_ID"];
  const key_secret = process.env["RAZORPAY_KEY_SECRET"];
  if (!key_id || !key_secret) {
    throw new Error("Razorpay keys not configured");
  }
  cachedClient = new Razorpay({ key_id, key_secret });
  return cachedClient;
}

export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = process.env["RAZORPAY_KEY_SECRET"];
  if (!secret) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expected === signature;
}

export function getRazorpayKeyId(): string {
  return process.env["RAZORPAY_KEY_ID"] ?? "";
}
