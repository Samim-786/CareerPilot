DROP TABLE IF EXISTS vector_store;

CREATE TABLE vector_store (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT,
    metadata JSONB,
    embedding vector(384)
);

CREATE INDEX IF NOT EXISTS vector_store_embedding_idx
ON vector_store
USING hnsw (embedding vector_cosine_ops);