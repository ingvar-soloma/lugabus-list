CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex
CREATE INDEX "PublicFigure_name_role_idx" ON "PublicFigure" USING GIN ("name" gin_trgm_ops, "role" gin_trgm_ops);
