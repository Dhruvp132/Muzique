import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prismaClient from "@/app/lib/db";
import { Session } from "next-auth"
import Stripe from "stripe";
import { authOptions } from "@/app/lib/auth";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");
export async function POST(request: NextRequest) {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    const { amount } = await request.json();

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    
    let songLimit: number = 2;  
    if(amount === 5.00 || amount === 5) songLimit = 5; 
    if(amount === 10.00 || amount === 10) songLimit = 10;
    if(amount === 20.00 || amount === 20) songLimit = 20;
    const userEmail = session?.user?.email ?? ""

    await prismaClient.user.update({
        where : {
            email : userEmail,    
        }, 
        data : {
          paid : true, 
          songLimit, 
        }
    })
    console.log(paymentIntent.client_secret)
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Internal Error:", error);
    // Handle other errors (e.g., network issues, parsing errors)
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}