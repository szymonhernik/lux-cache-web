# TO DO to add trial

- [ ] in admin.ts change TRIAL_PERIOD_DAYS to number of days
  - push changes
- [ ] on price update (in Stripe) this should update the price with that value
  - you can test it by adding new price or editting an existing one
  - listen to webhooks for price.updated event
  - to check if the trial_period_days on price has been updated console.log prices -> it should return trial_period_days: 7 (or any other number you set up)
- [ ] now you will work with the stripe/server.ts file. when creating stripe checkout session you will want to make sure the console.log that is already there (Trial end: ...) will console log correct UnixTimestamp (result of calculateTrialEndUnixTimestamp called later when setting params on recurring payment)
  - it should return something like 'Trial end: 1714042027' when you click Subscribe on the price you added or edited before and in the stripe checkout page it should give you some info on the left about the trial being set up, for example "Tryout Basic: 7 days for free. Next 5,00 eur per month"
