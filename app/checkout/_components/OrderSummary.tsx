import { useCustomCheckout } from '@stripe/react-stripe-js';
import { StripeCustomCheckoutLineItem } from '@stripe/stripe-js';

export default function OrderSummary(props: { daysTrial: number | null }) {
  const { confirm, canConfirm, confirmationRequirements, lineItems, currency } =
    useCustomCheckout();
  const { daysTrial } = props;

  // date 7 days from now
  function formatPrice(propertyName: string, currency: string) {
    const item = lineItems[0];
    const value = item[propertyName as keyof StripeCustomCheckoutLineItem];

    // Confirm the property exists and is a number. If not, default to 0.
    const amount = typeof value === 'number' ? value : 0;
    const priceString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount / 100);

    return priceString;
  }
  function calculateTotalDueToday() {
    const subtotal = lineItems[0].amountSubtotal || 0;
    const discount = lineItems[0].amountDiscount || 0;
    const totalDueToday = subtotal - discount;

    const priceString = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(totalDueToday / 100);

    return priceString;
  }
  let trialEndDate;
  if (daysTrial) {
    const currentDate = new Date(); // Get today's date
    currentDate.setDate(currentDate.getDate() + daysTrial); // Add the trial days

    // Format the date
    // const options = { year: 'numeric', month: 'short', day: 'numeric' };
    trialEndDate = currentDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  return (
    <div className="grow">
      <h1 className="font-bold text-xl mb-4">Order Summary</h1>

      <div className="bg-zinc-900 rounded p-4 w-full gap-4 flex flex-col">
        <div>
          <p className="font-semibold text-2xl">{lineItems[0]?.name}</p>
        </div>
        {trialEndDate && (
          <div className="flex justify-between ">
            <div>
              <p className="font-semibold text-xl">Billed after trial</p>
              <p>({trialEndDate})</p>
            </div>
            <p className="">{formatPrice('unitAmount', currency)}</p>
          </div>
        )}
        <div className="*:flex *:justify-between ">
          <div className="">
            <p>Subtotal </p>
            <p>{formatPrice('amountSubtotal', currency)}</p>
          </div>
          <div className="">
            <p className=" ">Discounted </p>
            <p className="text-gray-400">
              - {formatPrice('amountDiscount', currency)}
            </p>
          </div>
          <div className="mt-5">
            <p className="font-bold">Total due today: </p>
            <p>{calculateTotalDueToday()}</p>
          </div>
        </div>

        <div className="font-bold flex justify-between"></div>
      </div>
    </div>
  );
}
