# TO DO to add trial

- [ ] in admin.ts change TRIAL_PERIOD_DAYS to number of days
- [ ] on price update (in Stripe) this should update the price with that value
      (listen to webhooks for price.updated event)
      (to check if the trial_period_days on price has been updated console.log prices )
