import { NextResponse } from 'next/server';
import { getUser, createReferral, getBusinessBySlug } from '@/lib/db';
import { referralSchema, getFirstZodError } from '@/lib/validation';

export async function POST(request: Request) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to submit a referral' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = referralSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = getFirstZodError(parsed.error);
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { slug, customerName, customerEmail, customerPhone, notes } = parsed.data;

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
      business_id: business.id as string,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone ?? undefined,
      notes: notes ?? undefined,
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
