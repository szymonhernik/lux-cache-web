import Button from '@/components/ui/Button';

export default function DisplayPaymentData({
  paymentMethods,
  subscriptionDefaultPaymentMethodId
}: {
  paymentMethods: any;
  subscriptionDefaultPaymentMethodId: string;
}) {
  console.log('paymentMethods in new component', paymentMethods);
  return (
    <>
      {paymentMethods.length > 0 ? (
        <ul className="*:p-4 *:border *:border-zinc-600 *:my-2 *:rounded *:text-white">
          {/* @ts-ignore */}
          {paymentMethods.map((paymentMethod, index) => (
            <li
              key={`paymentMethod-${index}`}
              className="flex justify-between gap-4"
            >
              <div>
                <p className="uppercase font-semibold">
                  {paymentMethod.card.display_brand}
                </p>
                <p className="text-xs">
                  <span className="align-top text-[10px]">****</span>{' '}
                  {paymentMethod.card.last4} (expires{' '}
                  {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year})
                </p>
              </div>
              {/* display Button set as default for all but don't for the one that paymentMethods.id === subscriptionDefaultPaymentMethodId  */}

              <div className="flex gap-2">
                {paymentMethod.id ===
                subscriptionDefaultPaymentMethodId ? null : (
                  <Button
                    variant="slim"
                    type="submit"
                    className="!py-0 !px-4 "
                    // loading={isSubmitting}
                  >
                    Set as default
                  </Button>
                )}

                <Button
                  variant="slim"
                  type="submit"
                  className="!py-0 !px-4 "
                  // loading={isSubmitting}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
