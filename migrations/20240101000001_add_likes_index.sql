-- +goose Up
-- +goose StatementBegin
CREATE INDEX IF NOT EXISTS idx_fuckups_likes ON fuckups(likes DESC);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_fuckups_likes;
-- +goose StatementEnd 