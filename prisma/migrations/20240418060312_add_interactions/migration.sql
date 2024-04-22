-- CreateTable
CREATE TABLE "Interest" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Interest_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_InterestToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Interest_name_key" ON "Interest"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_InterestToUser_AB_unique" ON "_InterestToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_InterestToUser_B_index" ON "_InterestToUser"("B");

-- AddForeignKey
ALTER TABLE "_InterestToUser" ADD CONSTRAINT "_InterestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Interest"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InterestToUser" ADD CONSTRAINT "_InterestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
