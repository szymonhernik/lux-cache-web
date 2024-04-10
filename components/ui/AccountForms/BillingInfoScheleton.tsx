import Card from '@/components/ui/Card';

export default function BillingInfoScheleton() {
  return (
    <Card
      title="Billing information"
      description={`Your billing information from Stripe`}
    >
      <div className="mt-8 mb-4 text-base">
        <p>Loading billing information</p>
      </div>
    </Card>
  );
}
