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
  id = $1;

-- name: ConsumeInviteCode :exec
UPDATE invite_codes
SET
  used_at = CURRENT_TIMESTAMP
WHERE
  code = $1
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
      code = $1
  );

-- name: CreatePlayer :execresult
INSERT INTO
  players (username, invite_code_id, race_id, class_id)
VALUES
  (
    $1,
    (
      SELECT
        id
      FROM
        invite_codes
      WHERE
        code = $2
    ),
    $3,
    $4
  );

-- name: DeletePlayer :exec
DELETE FROM players
WHERE
  id = $1;

-- name: SetPlayerRace :exec
UPDATE players
SET
  race_id = $1
WHERE
  id = $2;

-- name: SetPlayerClass :exec
UPDATE players
SET
  class_id = $1
WHERE
  id = $2;

-- name: GetPlayerRace :one
SELECT
  races.name,
  races.slug
FROM
  players
  INNER JOIN races ON races.id = players.race_id
WHERE
  players.id = $1;

-- name: GetPlayerClass :one
SELECT
  classes.name,
  classes.slug
FROM
  players
  INNER JOIN classes ON classes.id = players.class_id
WHERE
  players.id = $1;

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
  code = $1;
