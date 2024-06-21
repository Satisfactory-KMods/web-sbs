CREATE SCHEMA "sbs";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."blueprint" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar(1024) NOT NULL,
	"raw_name" varchar(1024) NOT NULL,
	"images" json NOT NULL,
	"size" integer NOT NULL,
	"description" varchar(1024) NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"updated" timestamp with time zone DEFAULT now() NOT NULL,
	"is_modded" boolean NOT NULL,
	"download" integer NOT NULL,
	"icon_data" json NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."blueprint_mods" (
	"id" integer NOT NULL,
	"mod_ref" varchar(128) NOT NULL,
	CONSTRAINT "blueprint_mods_id_mod_ref_pk" PRIMARY KEY("id","mod_ref")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."blueprint_tags" (
	"id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "blueprint_tags_id_tag_id_pk" PRIMARY KEY("id","tag_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."tags" (
	"tag_id" serial PRIMARY KEY NOT NULL,
	"tag" varchar(1024) NOT NULL,
	CONSTRAINT "tags_tag_unique" UNIQUE("tag")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."blueprint_mods" ADD CONSTRAINT "blueprint_mods_id_blueprint_id_fk" FOREIGN KEY ("id") REFERENCES "sbs"."blueprint"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."blueprint_tags" ADD CONSTRAINT "blueprint_tags_id_blueprint_id_fk" FOREIGN KEY ("id") REFERENCES "sbs"."blueprint"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."blueprint_tags" ADD CONSTRAINT "blueprint_tags_tag_id_tags_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "sbs"."tags"("tag_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
