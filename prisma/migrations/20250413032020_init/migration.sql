-- CreateEnum
CREATE TYPE "PermissionRuleTypes" AS ENUM ('permissionGroup', 'user', 'auctionProperties');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,
    "address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_groups" (
    "id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "permission_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission_rules" (
    "id" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "type" "PermissionRuleTypes" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "permission_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_permission_groups" (
    "user_id" TEXT NOT NULL,
    "permission_group_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "permission_groups_rules" (
    "permission_group_id" TEXT NOT NULL,
    "permission_rule_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auction_properties" (
    "id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "number_property" BIGINT NOT NULL,
    "uf" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" BIGINT NOT NULL,
    "appraisal_value" BIGINT NOT NULL,
    "discount" BIGINT NOT NULL,
    "property_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sale_method" TEXT NOT NULL,
    "access_link" TEXT NOT NULL,
    "accept_financing" BOOLEAN NOT NULL DEFAULT false,
    "photo_link" TEXT,
    "registration_property_link" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auction_properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "permission_groups_name_key" ON "permission_groups"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_rules_rule_key" ON "permission_rules"("rule");

-- CreateIndex
CREATE UNIQUE INDEX "users_permission_groups_user_id_permission_group_id_key" ON "users_permission_groups"("user_id", "permission_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_groups_rules_permission_group_id_permission_rule_key" ON "permission_groups_rules"("permission_group_id", "permission_rule_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission_groups" ADD CONSTRAINT "permission_groups_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_permission_groups" ADD CONSTRAINT "users_permission_groups_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_permission_groups" ADD CONSTRAINT "users_permission_groups_permission_group_id_fkey" FOREIGN KEY ("permission_group_id") REFERENCES "permission_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_groups_rules" ADD CONSTRAINT "permission_groups_rules_permission_group_id_fkey" FOREIGN KEY ("permission_group_id") REFERENCES "permission_groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission_groups_rules" ADD CONSTRAINT "permission_groups_rules_permission_rule_id_fkey" FOREIGN KEY ("permission_rule_id") REFERENCES "permission_rules"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auction_properties" ADD CONSTRAINT "auction_properties_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
