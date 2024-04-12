export default function DisplayPaymentData({
  paymentMethods
}: {
  paymentMethods: any;
}) {
  console.log('paymentMethods in new component', paymentMethods);
  return (
    <>
      {paymentMethods.length > 0 ? (
        <ul className="*:p-4 *:border *:border-zinc-600 *:my-2 *:rounded *:text-white">
          {/* @ts-ignore */}
          {paymentMethods.map((paymentMethod, index) => (
            <li key={`paymentMethod-${index}`}>
              <p className="uppercase font-semibold">
                {paymentMethod.card.display_brand}
              </p>
              <p className="text-xs">
                <span className="align-top text-[10px]">****</span>{' '}
                {paymentMethod.card.last4} (expires{' '}
                {paymentMethod.card.exp_month}/{paymentMethod.card.exp_year})
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
