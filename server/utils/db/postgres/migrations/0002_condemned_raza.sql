ALTER TABLE "sbs"."blueprint" ALTER COLUMN "name" SET DATA TYPE varchar(2048);--> statement-breakpoint
ALTER TABLE "sbs"."blueprint" ALTER COLUMN "raw_name" SET DATA TYPE varchar(2048);--> statement-breakpoint
ALTER TABLE "sbs"."blueprint" ALTER COLUMN "description" SET DATA TYPE varchar(4096);--> statement-breakpoint
ALTER TABLE "sbs"."blueprint" ALTER COLUMN "scim_user" SET DATA TYPE varchar(2048);