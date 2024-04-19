import { PaymentElement, useCustomCheckout } from '@stripe/react-stripe-js';
import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function PaymentMethodSetupForm(props: {
  onConfirmNewCard: () => void;
}) {
  const { onConfirmNewCard } = props;
  const { confirm, canConfirm } = useCustomCheckout();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [messageBody, setMessageBody] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // if can't confirm don't allow form submission
    if (!canConfirm) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    e.preventDefault();
    setIsSubmitting(true);

    //  confirm() method returns a Promise that resolves to an object with one of the following types
    //  { session: CheckoutSession }
    //  { error: StripeError }
    confirm().then((result) => {
      setIsSubmitting(false);
      if (result.session) {
        setIsSuccess(true);
        onConfirmNewCard();
      } else {
        setMessageBody(result.error.message || 'An error occurred');
      }
    });
  };

  return (
    <div>
      {!isSuccess ? (
        <form onSubmit={(e) => handleSubmit(e)}>
          <PaymentElement />
          <div
            id="messages"
            role="alert"
            style={messageBody ? { display: 'block' } : {}}
          >
            {messageBody}
          </div>
          <Button
            variant="slim"
            className="mt-16"
            loading={isSubmitting}
            disabled={!canConfirm || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Processing' : 'Update payment method'}
          </Button>
        </form>
      ) : (
        <div>
          <h1 className="text-xl font-bold mb-4">Success</h1>
          <p>You have added a new card.</p>
        </div>
      )}
    </div>
  );
}
