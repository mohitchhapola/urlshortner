-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('GUEST', 'REGISTERED');

-- CreateTable
CREATE TABLE "users" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255),
    "password" TEXT,
    "user_type" "UserType" NOT NULL DEFAULT 'GUEST',
    "guest_token" UUID,
    "expires_at" TIMESTAMPTZ,
    "isactive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "urls" (
    "urlid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userid" UUID NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_code" VARCHAR(20) NOT NULL,
    "custom_alias" VARCHAR(100),
    "isactive" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMPTZ,
    "click_count" BIGINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("urlid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key"
ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_guest_token_key"
ON "users"("guest_token");

-- CreateIndex
CREATE INDEX "users_guest_token_idx"
ON "users"("guest_token");

-- CreateIndex
CREATE INDEX "users_expires_at_idx"
ON "users"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "urls_short_code_key"
ON "urls"("short_code");

-- CreateIndex
CREATE UNIQUE INDEX "urls_custom_alias_key"
ON "urls"("custom_alias");

-- CreateIndex
CREATE INDEX "urls_userid_idx"
ON "urls"("userid");

-- CreateIndex
CREATE INDEX "urls_expires_at_idx"
ON "urls"("expires_at");

-- AddForeignKey
ALTER TABLE "urls"
ADD CONSTRAINT "urls_userid_fkey"
FOREIGN KEY ("userid")
REFERENCES "users"("uid")
ON DELETE CASCADE
ON UPDATE CASCADE;