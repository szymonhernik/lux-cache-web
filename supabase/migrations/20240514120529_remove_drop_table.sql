revoke delete on table "public"."drop later table" from "anon";

revoke insert on table "public"."drop later table" from "anon";

revoke references on table "public"."drop later table" from "anon";

revoke select on table "public"."drop later table" from "anon";

revoke trigger on table "public"."drop later table" from "anon";

revoke truncate on table "public"."drop later table" from "anon";

revoke update on table "public"."drop later table" from "anon";

revoke delete on table "public"."drop later table" from "authenticated";

revoke insert on table "public"."drop later table" from "authenticated";

revoke references on table "public"."drop later table" from "authenticated";

revoke select on table "public"."drop later table" from "authenticated";

revoke trigger on table "public"."drop later table" from "authenticated";

revoke truncate on table "public"."drop later table" from "authenticated";

revoke update on table "public"."drop later table" from "authenticated";

revoke delete on table "public"."drop later table" from "service_role";

revoke insert on table "public"."drop later table" from "service_role";

revoke references on table "public"."drop later table" from "service_role";

revoke select on table "public"."drop later table" from "service_role";

revoke trigger on table "public"."drop later table" from "service_role";

revoke truncate on table "public"."drop later table" from "service_role";

revoke update on table "public"."drop later table" from "service_role";

alter table "public"."drop later table" drop constraint "drop later table_pkey";

drop index if exists "public"."drop later table_pkey";

drop table "public"."drop later table";





