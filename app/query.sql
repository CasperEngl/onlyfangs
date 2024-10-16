-- name: GetPlayers :many
SELECT
  *
FROM
  players;

-- name: GetPlayerById :one
SELECT
  *
FROM
  players
WHERE
  id = ?;

-- name: ConsumeInviteCode :exec
UPDATE invite_codes
SET
  used_at = CURRENT_TIMESTAMP
WHERE
  code = ?
  AND used_at IS NULL;

-- name: GetPlayerByInviteCode :one
SELECT
  *
FROM
  players
WHERE
  invite_code_id = (
    SELECT
      id
    FROM
      invite_codes
    WHERE
      code = ?
  );

-- name: CreatePlayer :execresult
INSERT INTO
  players (username, invite_code_id, race_id, class_id)
VALUES
  (
    ?,
    (
      SELECT
        id
      FROM
        invite_codes
      WHERE
        code = ?
    ),
    ?,
    ?
  );

-- name: DeletePlayer :exec
DELETE FROM players
WHERE
  id = ?;

-- name: SetPlayerRace :exec
UPDATE players
SET
  race_id = ?
WHERE
  id = ?;

-- name: SetPlayerClass :exec
UPDATE players
SET
  class_id = ?
WHERE
  id = ?;

-- name: GetPlayerRace :one
SELECT
  races.name,
  races.slug
FROM
  players
  INNER JOIN races ON races.id = players.race_id
WHERE
  players.id = ?;

-- name: GetPlayerClass :one
SELECT
  classes.name,
  classes.slug
FROM
  players
  INNER JOIN classes ON classes.id = players.class_id
WHERE
  players.id = ?;

-- name: GetRaces :many
SELECT
  *
FROM
  races;

-- name: GetClasses :many
SELECT
  *
FROM
  classes;

-- name: GetInviteCode :one
SELECT
  *
FROM
  invite_codes
WHERE
  code = ?;
