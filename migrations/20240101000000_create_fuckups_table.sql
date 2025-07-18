-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS fuckups (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user TEXT NOT NULL,
    desc TEXT,
    likes INTEGER DEFAULT 0
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS fuckups;
-- +goose StatementEnd 