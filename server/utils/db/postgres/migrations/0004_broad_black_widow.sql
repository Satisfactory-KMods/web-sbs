DO $$ BEGIN
 CREATE TYPE "public"."enum_adapter_auth_type" AS ENUM('oauth', 'oidc', 'email', 'webauthn');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."account" (
	"userId" bigint NOT NULL,
	"type" "enum_adapter_auth_type" NOT NULL,
	"provider" varchar(1024) NOT NULL,
	"providerAccountId" bigint NOT NULL,
	"refresh_token" varchar(1024),
	"access_token" varchar(1024),
	"expires_at" timestamp with time zone,
	"token_type" varchar(1024),
	"scope" varchar(1024),
	"id_token" varchar(1024),
	"session_state" varchar(1024),
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."session" (
	"sessionToken" varchar(1024) PRIMARY KEY NOT NULL,
	"userId" bigint NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone,
	"image" varchar(1024),
	"hoster" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sbs"."verificationToken" (
	"identifier" varchar(1024) NOT NULL,
	"token" varchar(1024) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "sbs"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "sbs"."session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "sbs"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "account_providerAccountId_index" ON "sbs"."account" USING btree ("providerAccountId");