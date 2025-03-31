-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "image" BLOB NOT NULL DEFAULT ''
);
INSERT INTO "new_App" ("id", "name", "port") SELECT "id", "name", "port" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
