-- CreateTable
CREATE TABLE "ItemCommands" (
    "id" SERIAL NOT NULL,
    "itemCommand" TEXT,
    "shopItemsId" INTEGER,

    CONSTRAINT "ItemCommands_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItemCommands" ADD CONSTRAINT "ItemCommands_shopItemsId_fkey" FOREIGN KEY ("shopItemsId") REFERENCES "ShopItems"("id") ON DELETE SET NULL ON UPDATE CASCADE;
