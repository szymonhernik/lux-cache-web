'use client';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { updateSubscriptionPlan } from '@/utils/stripe/server';
import { ProductWithPrices, SubscriptionWithProduct } from '@/utils/types';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

export default function PremiumPlansPanel(props: Props) {
  const { products, subscription } = props;
  const isSubscribedTo = (priceId: string) => {
    return subscription?.prices?.id === priceId;
  };
  const router = useRouter();
  const currentPath = usePathname();
  const handleSwitchPlans = async (
    subscriptionId: string | undefined,
    newPriceId: string
  ) => {
    if (!subscriptionId || !newPriceId) {
      return;
    }
    const redirectUrl = await updateSubscriptionPlan(
      subscriptionId,
      newPriceId,
      currentPath
    );
    if (redirectUrl) {
      router.push(redirectUrl);
      router.refresh();
    }
  };
  return (
    <Card
      title="Premium Plans"
      description={
        subscription
          ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
          : 'You are not currently subscribed to any plan.'
      }
    >
      {/* <div className="mt-8 mb-4 text-xl font-semibold">Plans</div> */}
      <ul className="mt-4">
        {products.map((product) => (
          <li key={product.id} className="mt-4">
            <h2 className="font-semibold">{product.name}</h2>

            <div className="w-full flex gap-4">
              {product.prices.map((price) => (
                <div
                  key={price.id}
                  className="flex justify-between items-center mt-2"
                >
                  <Button
                    variant="slim"
                    disabled={isSubscribedTo(price.id)}
                    onClick={() =>
                      handleSwitchPlans(subscription?.id, price.id)
                    }
                  >
                    <span>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: price.currency!,
                        minimumFractionDigits: 0
                      }).format((price?.unit_amount || 0) / 100)}{' '}
                      / {price.interval}
                    </span>
                  </Button>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
