
create
or replace function public.custom_access_token_hook_test_six (event jsonb) returns jsonb language plpgsql stable as $$
  declare
    claims jsonb;
    user_role public.app_role;
    subscription_price_id text;
    product_name text;
  begin
    -- Check if the user is marked as admin in the profiles table
    select role into user_role from public.user_roles where user_id = (event->>'user_id')::uuid;

    -- Get the subscription price id for the current user
    select price_id into subscription_price_id from public.subscriptions where user_id = (event->>'user_id')::uuid;

     -- Get the product name for the subscription price
    select name into product_name from public.products where id = (select product_id from public.prices where id = subscription_price_id);


    claims := event->'claims';

    if user_role is not null then
      -- Set the claim
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    else
      claims := jsonb_set(claims, '{user_role}', 'null');
    end if;

    if subscription_price_id is not null then
      -- Set the subscription price id claim
      claims := jsonb_set(claims, '{subscription_price_id}', to_jsonb(subscription_price_id));
    else
      claims := jsonb_set(claims, '{subscription_price_id}', 'null');
    end if;

    if product_name is not null then
      -- Set the product name claim
      claims := jsonb_set(claims, '{product_name}', to_jsonb(product_name));
    else
      claims := jsonb_set(claims, '{product_name}', 'null');
    end if;

    -- Update the 'claims' object in the original event
    event := jsonb_set(event, '{claims}', claims);

    -- Return the modified or original event
    return event;
  end;
$$;

grant usage on schema public to supabase_auth_admin;

grant
execute on function public.custom_access_token_hook to supabase_auth_admin;

revoke
execute on function public.custom_access_token_hook
from
  authenticated,
  anon;

grant all on table public.user_roles to supabase_auth_admin;
grant all on table public.subscriptions to supabase_auth_admin;
grant all on table public.products to supabase_auth_admin;
grant all on table public.prices to supabase_auth_admin;

revoke all on table public.user_roles
from
  authenticated,
  anon;

revoke all on table public.subscriptions
from
  authenticated,
  anon;

revoke all on table public.products
from
  authenticated,
  anon;

revoke all on table public.prices
from
  authenticated,
  anon;

create policy "Allow auth admin to read user roles" on public.user_roles as permissive for
select
  to supabase_auth_admin using (true);

create policy "Allow auth admin to read subscriptions info " on public.subscriptions as permissive for
select
  to supabase_auth_admin using (true);

create policy "Allow auth admin to read products name " on public.products as permissive for
select
  to supabase_auth_admin using (true);
  
  create policy "Allow auth admin to read prices table" on public.prices as permissive for
select
  to supabase_auth_admin using (true);

