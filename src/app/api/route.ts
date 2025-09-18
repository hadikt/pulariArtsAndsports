import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const razorpay = new Razorpay({
  key_id: 'rzp_test_YOUR_KEY_HERE', // Replace with your key_id
  key_secret: 'YOUR_SECRET_HERE', // Replace with your key_secret
});

export async function POST(request: Request) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json();

  const generatedSignature = crypto
    .createHmac('sha256', 'YOUR_SECRET_HERE')
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature === razorpay_signature) {
    // Optionally save user data to DB/email here
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false }, { status: 400 });
}