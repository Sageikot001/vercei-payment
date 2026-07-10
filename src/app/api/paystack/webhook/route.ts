import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      console.error('Invalid Paystack webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);
    const supabase = createAdminClient();

    switch (event.event) {
      case 'charge.success': {
        const { reference, customer, amount, currency, metadata } = event.data;

        // Find user by email
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customer.email)
          .single();

        if (!profile) {
          console.error('User not found for email:', customer.email);
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Calculate expiration based on billing period
        const billingPeriod = metadata?.billingPeriod || '12-months';
        const months = parseInt(billingPeriod.split('-')[0]);
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + months);

        // Create or update subscription
        const { error: subscriptionError } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: profile.id,
            plan: metadata?.plan || 'basic',
            billing_period: billingPeriod,
            status: 'active',
            paystack_reference: reference,
            paystack_customer_code: customer.customer_code,
            amount_paid: amount,
            currency: currency,
            starts_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
          }, {
            onConflict: 'user_id',
          });

        if (subscriptionError) {
          console.error('Error creating subscription:', subscriptionError);
          return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 });
        }

        console.log('Subscription activated for user:', profile.id);
        break;
      }

      case 'subscription.disable':
      case 'subscription.not_renew': {
        const { customer } = event.data;

        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', customer.email)
          .single();

        if (profile) {
          await supabase
            .from('subscriptions')
            .update({ status: 'cancelled' })
            .eq('user_id', profile.id);
        }
        break;
      }

      case 'charge.failed': {
        const { customer, metadata } = event.data;
        console.log('Payment failed for:', customer.email, 'Plan:', metadata?.plan);
        break;
      }

      default:
        console.log('Unhandled Paystack event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
