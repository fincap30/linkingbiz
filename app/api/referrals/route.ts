import { NextResponse } from 'next/server';
import { getUser, createReferral, getBusinessBySlug } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a referral' },
        { status: 401 }
      );
    }

    const { slug, customerName, customerEmail, customerPhone, notes } = await request.json();

    if (!slug || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get business by slug
    const business = await getBusinessBySlug(slug);
    
    if (!business) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Create referral
    const referralId = await createReferral({
      referrer_id: user.id,
      business_id: business.id,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      notes,
    });

    return NextResponse.json({ id: referralId });
  } catch (err) {
    console.error('Referral error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
