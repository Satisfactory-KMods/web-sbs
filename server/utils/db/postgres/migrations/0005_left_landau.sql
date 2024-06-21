CREATE TABLE IF NOT EXISTS "sbs"."blueprintpacks" (
	"pack_id" serial PRIMARY KEY NOT NULL,
	"creator" bigint NOT NULL,
	"name" varchar(2048) NOT NULL,
	"description" varchar(32768) NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"updated" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."blueprintpacks_blueprints" (
	"id" integer NOT NULL,
	"pack_id" integer NOT NULL,
	CONSTRAINT "blueprintpacks_blueprints_id_pack_id_pk" PRIMARY KEY("id","pack_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."blueprintpacks" ADD CONSTRAINT "blueprintpacks_creator_account_providerAccountId_fk" FOREIGN KEY ("creator") REFERENCES "sbs"."account"("providerAccountId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."blueprintpacks_blueprints" ADD CONSTRAINT "blueprintpacks_blueprints_id_blueprint_id_fk" FOREIGN KEY ("id") REFERENCES "sbs"."blueprint"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."blueprintpacks_blueprints" ADD CONSTRAINT "blueprintpacks_blueprints_pack_id_blueprintpacks_pack_id_fk" FOREIGN KEY ("pack_id") REFERENCES "sbs"."blueprintpacks"("pack_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
