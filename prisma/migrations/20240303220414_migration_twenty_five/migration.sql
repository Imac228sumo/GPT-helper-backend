-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_item" DROP CONSTRAINT "Order_item_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_referred_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Referral" DROP CONSTRAINT "Referral_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_user_id_fkey";

-- DropForeignKey
ALTER TABLE "claimed_bonuses" DROP CONSTRAINT "claimed_bonuses_referral_id_fkey";

-- DropForeignKey
ALTER TABLE "completion_options_open_ai" DROP CONSTRAINT "completion_options_open_ai_open_ai_api_id_fkey";

-- DropForeignKey
ALTER TABLE "open_ai_chat" DROP CONSTRAINT "open_ai_chat_user_id_fkey";

-- DropForeignKey
ALTER TABLE "open_ai_message" DROP CONSTRAINT "open_ai_message_chat_id_fkey";

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referred_by_user_id_fkey" FOREIGN KEY ("referred_by_user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claimed_bonuses" ADD CONSTRAINT "claimed_bonuses_referral_id_fkey" FOREIGN KEY ("referral_id") REFERENCES "Referral"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_ai_chat" ADD CONSTRAINT "open_ai_chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "open_ai_message" ADD CONSTRAINT "open_ai_message_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "open_ai_chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "completion_options_open_ai" ADD CONSTRAINT "completion_options_open_ai_open_ai_api_id_fkey" FOREIGN KEY ("open_ai_api_id") REFERENCES "open_ai_api"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_item" ADD CONSTRAINT "Order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
