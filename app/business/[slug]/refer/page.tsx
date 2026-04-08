import ReferralForm from './ReferralForm';

interface ReferralPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all business slugs
export async function generateStaticParams() {
  // For static export, we'll return an empty array
  // The pages will be generated on-demand at build time
  return [];
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const { slug } = await params;
  return <ReferralForm slug={slug} />;
}
