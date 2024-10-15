-- name: GetPlayers :many
SELECT * FROM players;

-- name: GetPlayerById :one
SELECT * FROM players WHERE id = ?;

-- name: CreatePlayer :execresult
INSERT INTO players (username, invite_code, race_id, class_id, created_by)
VALUES (?, ?, ?, ?, ?);

-- name: UpdatePlayer :exec
UPDATE players
SET username = ?, invite_code = ?, race_id = ?, class_id = ?, created_by = ?
WHERE id = ?;

-- name: DeletePlayer :exec
DELETE FROM players WHERE id = ?;

-- name: AddPlayerRace :exec
UPDATE players
SET race_id = ?
WHERE id = ?;

-- name: AddPlayerClass :exec
UPDATE players
SET class_id = ? WHERE id = ?;
