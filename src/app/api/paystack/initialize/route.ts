import { NextRequest, NextResponse } from 'next/server';
import { getPlanById, getBillingPeriod, BillingPeriod } from '@/lib/plans';
import { generateReference, getAmountInKobo } from '@/lib/paystack';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, planId, billingPeriod } = body as {
      email: string;
      planId: string;
      billingPeriod: BillingPeriod;
    };

    if (!email || !planId) {
      return NextResponse.json(
        { error: 'Email and plan are required' },
        { status: 400 }
      );
    }

    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const period = getBillingPeriod(billingPeriod || '24-months');
    const reference = generateReference();
    const amount = getAmountInKobo(plan, billingPeriod || '24-months');

    // Get base URL from environment (required in production)
    let baseUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!baseUrl && process.env.VERCEL_URL) {
      baseUrl = `https://${process.env.VERCEL_URL}`;
    }
    // Only allow Origin fallback in development
    if (!baseUrl) {
      if (process.env.NODE_ENV === 'development') {
        baseUrl = request.headers.get('origin') || 'http://localhost:3000';
      } else {
        return NextResponse.json(
          { error: 'Server configuration error: NEXT_PUBLIC_APP_URL required' },
          { status: 500 }
        );
      }
    }
    const callbackUrl = `${baseUrl}/success`;

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency: 'NGN',
        reference,
        callback_url: callbackUrl,
        metadata: {
          plan_id: plan.id,
          plan_name: plan.name,
          billing_period: billingPeriod,
          duration_months: period?.months,
        },
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return NextResponse.json(
        { error: data.message || 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      amount,
    });
  } catch (error) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
