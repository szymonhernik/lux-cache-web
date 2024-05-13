SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.6 (Ubuntu 15.6-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'e3bbcb42-d153-4836-bf5e-b71d94b9126b', '{"action":"user_confirmation_requested","actor_id":"2d5fd7b8-9f02-4cd2-aa6c-c51292b3b0c8","actor_username":"iszszistudio@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}', '2024-05-13 10:38:56.231111+00', ''),
	('00000000-0000-0000-0000-000000000000', '007f8d46-bbf9-425b-ba04-94b28b8d63bb', '{"action":"user_signedup","actor_id":"2d5fd7b8-9f02-4cd2-aa6c-c51292b3b0c8","actor_username":"iszszistudio@gmail.com","actor_via_sso":false,"log_type":"team"}', '2024-05-13 10:39:06.266718+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b69521a-d8ae-4c1b-805b-cbdcdd8aa13d', '{"action":"login","actor_id":"2d5fd7b8-9f02-4cd2-aa6c-c51292b3b0c8","actor_username":"iszszistudio@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-05-13 10:39:12.071749+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a0184fe4-0710-43f2-a99a-b309a7f7aede', '{"action":"logout","actor_id":"2d5fd7b8-9f02-4cd2-aa6c-c51292b3b0c8","actor_username":"iszszistudio@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-13 11:29:53.1482+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ecd54f52-f287-49cb-a7f6-46179b943ff3', '{"action":"user_signedup","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy_her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"discord"}}', '2024-05-13 11:30:04.920422+00', ''),
	('00000000-0000-0000-0000-000000000000', '162c9265-c910-49fc-8109-6904f5523272', '{"action":"login","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy_her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"discord"}}', '2024-05-13 11:30:05.356218+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea0c731f-d0e0-4ff8-8198-878830a04de0', '{"action":"logout","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy_her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-13 11:30:49.406484+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f4c0db08-9777-43f8-9cd3-d49eb91228cf', '{"action":"login","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-05-13 11:31:35.557446+00', ''),
	('00000000-0000-0000-0000-000000000000', '850c1583-3c9d-40ed-b5be-8497ab3d702c', '{"action":"login","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-05-13 11:31:35.73409+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd47b04fe-369a-4926-ba7e-368e4ab37a26', '{"action":"logout","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account"}', '2024-05-13 11:32:31.432715+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c7ef4fb-170a-42db-8230-bc1d74d006df', '{"action":"login","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2024-05-13 11:32:33.90932+00', ''),
	('00000000-0000-0000-0000-000000000000', '7775c15a-d372-4698-9474-481a85313af8', '{"action":"login","actor_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","actor_name":"szy her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-05-13 11:32:34.124791+00', ''),
	('00000000-0000-0000-0000-000000000000', '635b6155-032a-42e2-9e74-da573a164199', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"szymonhernik123@gmail.com","user_id":"9cfa7a7f-eb7e-4327-8d16-d49907dc87dd","user_phone":""}}', '2024-05-13 11:32:46.804031+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da3bde7c-59c2-439c-ad5c-337e24eee566', '{"action":"user_signedup","actor_id":"fa13f337-683b-4d1b-b52c-cf3e9a4d42fb","actor_name":"szy her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2024-05-13 11:32:55.343037+00', ''),
	('00000000-0000-0000-0000-000000000000', '05090338-1675-4264-b469-6c890f813b09', '{"action":"login","actor_id":"fa13f337-683b-4d1b-b52c-cf3e9a4d42fb","actor_name":"szy her","actor_username":"szymonhernik123@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider_type":"github"}}', '2024-05-13 11:32:55.474446+00', ''),
	('00000000-0000-0000-0000-000000000000', '2cb13e40-796a-49e8-8300-78ecfa8fcc62', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"iszszistudio@gmail.com","user_id":"2d5fd7b8-9f02-4cd2-aa6c-c51292b3b0c8","user_phone":""}}', '2024-05-13 11:33:42.571456+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") VALUES
	('e313f9ad-62dc-4c0e-ace9-873e6b34edf2', '2d5fd7b8-9f02-4cd2-aa6c-c51292b3b0c8', '4b5918f3-e4a9-49b6-bd78-5339b71bc8c8', 's256', '5JbgYNgqOJpJnnbw2zXLKxnLOvN2hBrsxSZ2rOFfL7U', 'email', '', '', '2024-05-13 10:38:56.235703+00', '2024-05-13 10:39:06.271467+00', 'email/signup', '2024-05-13 10:39:06.271421+00');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'fa13f337-683b-4d1b-b52c-cf3e9a4d42fb', 'authenticated', 'authenticated', 'szymonhernik123@gmail.com', '', '2024-05-13 11:32:55.34361+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-05-13 11:32:55.474961+00', '{"provider": "github", "providers": ["github"]}', '{"iss": "https://api.github.com", "sub": "23366729", "name": "szy her", "email": "szymonhernik123@gmail.com", "full_name": "szy her", "user_name": "szymonhernik", "avatar_url": "https://avatars.githubusercontent.com/u/23366729?v=4", "provider_id": "23366729", "email_verified": true, "phone_verified": false, "preferred_username": "szymonhernik"}', NULL, '2024-05-13 11:32:55.33425+00', '2024-05-13 11:32:55.476777+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('23366729', 'fa13f337-683b-4d1b-b52c-cf3e9a4d42fb', '{"iss": "https://api.github.com", "sub": "23366729", "name": "szy her", "email": "szymonhernik123@gmail.com", "full_name": "szy her", "user_name": "szymonhernik", "avatar_url": "https://avatars.githubusercontent.com/u/23366729?v=4", "provider_id": "23366729", "email_verified": true, "phone_verified": false, "preferred_username": "szymonhernik"}', 'github', '2024-05-13 11:32:55.340156+00', '2024-05-13 11:32:55.34021+00', '2024-05-13 11:32:55.34021+00', '55fc5121-c325-4874-916b-ad0a60a8f82f');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('c4b4245d-1334-4990-ab9b-e1a67b865f4c', 'fa13f337-683b-4d1b-b52c-cf3e9a4d42fb', '2024-05-13 11:32:55.475026+00', '2024-05-13 11:32:55.475026+00', NULL, 'aal1', NULL, NULL, 'node', '81.247.83.158', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('c4b4245d-1334-4990-ab9b-e1a67b865f4c', '2024-05-13 11:32:55.480616+00', '2024-05-13 11:32:55.480616+00', 'oauth', '8c330833-1d63-4dfa-9b91-b70d2edebac3');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 5, 'ilYMCcTDX6B3Ayb0j3WKBg', 'fa13f337-683b-4d1b-b52c-cf3e9a4d42fb', false, '2024-05-13 11:32:55.475671+00', '2024-05-13 11:32:55.475671+00', NULL, 'c4b4245d-1334-4990-ab9b-e1a67b865f4c');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."products" ("id", "active", "name", "description", "image", "metadata") VALUES
	('prod_Q69AAYcHk0F7D0', true, 'Hobby', 'Hobby product description', NULL, '{"index": "0", "trial_allowed": "true"}'),
	('prod_Q69AZh57KF3rb4', true, 'Freelancer', 'Freelancer product description', NULL, '{"index": "1"}'),
	('prod_Q68b5xVpUJJNY3', true, 'Test', NULL, NULL, '{}'),
	('prod_Q68fX7PTwVYOC6', true, 'Test 2', NULL, NULL, '{}'),
	('prod_Q68tHdGvkzQeEs', true, 'New test', NULL, NULL, '{}');


--
-- Data for Name: prices; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prices" ("id", "product_id", "active", "description", "unit_amount", "currency", "type", "interval", "interval_count", "trial_period_days", "metadata") VALUES
	('price_1PFwscC5Vnk6f7u91QK4dPnl', 'prod_Q69AAYcHk0F7D0', true, NULL, 10000, 'usd', 'recurring', 'year', 1, 7, '{}'),
	('price_1PFwscC5Vnk6f7u9PIOIqiot', 'prod_Q69AAYcHk0F7D0', true, NULL, 1000, 'usd', 'recurring', 'month', 1, 7, '{}'),
	('price_1PFwsdC5Vnk6f7u9qYgdrR01', 'prod_Q69AZh57KF3rb4', true, NULL, 2000, 'usd', 'recurring', 'month', 1, 7, '{}'),
	('price_1PFwsdC5Vnk6f7u9hSZF5fq9', 'prod_Q69AZh57KF3rb4', true, NULL, 20000, 'usd', 'recurring', 'year', 1, 7, '{}'),
	('price_1PFwK8C5Vnk6f7u9pPAEJB6b', 'prod_Q68b5xVpUJJNY3', true, NULL, 100, 'eur', 'recurring', 'month', 1, 7, '{}'),
	('price_1PFwKkC5Vnk6f7u9jj5j2Rxg', 'prod_Q68b5xVpUJJNY3', true, NULL, 1000, 'eur', 'recurring', 'year', 1, 7, '{}'),
	('price_1PFwOOC5Vnk6f7u9yFw9IFQm', 'prod_Q68fX7PTwVYOC6', true, NULL, 13000, 'eur', 'recurring', 'year', 1, 7, '{}'),
	('price_1PFwbUC5Vnk6f7u92NZLNQ8g', 'prod_Q68tHdGvkzQeEs', true, NULL, 400, 'eur', 'recurring', 'month', 1, 7, '{}'),
	('price_1PFwgoC5Vnk6f7u9C7q46OUD', 'prod_Q68tHdGvkzQeEs', true, NULL, 4000, 'eur', 'recurring', 'year', 1, 7, '{}');


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "full_name", "avatar_url", "billing_address", "payment_method", "can_trial") VALUES
	('fa13f337-683b-4d1b-b52c-cf3e9a4d42fb', 'szy her', 'https://avatars.githubusercontent.com/u/23366729?v=4', NULL, NULL, true);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 5, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
