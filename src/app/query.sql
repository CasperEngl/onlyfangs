-- name: GetPlayers :many
SELECT
  *
FROM
  users;

-- name: GetPlayerById :one
SELECT
  *
FROM
  users
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
  users
WHERE
  invite_code_id = (
    SELECT
      id
    FROM
      invite_codes
    WHERE
      code = $1
  );

-- name: DeletePlayer :exec
DELETE FROM users
WHERE
  id = $1;

-- name: SetPlayerRace :exec
UPDATE users
SET
  race_id = $1
WHERE
  id = $2;

-- name: SetPlayerClass :exec
UPDATE users
SET
  class_id = $1
WHERE
  id = $2;

-- name: GetPlayerRace :one
SELECT
  races.name,
  races.slug
FROM
  users
  INNER JOIN races ON races.id = users.race_id
WHERE
  users.id = $1;

-- name: GetPlayerClass :one
SELECT
  classes.name,
  classes.slug
FROM
  users
  INNER JOIN classes ON classes.id = users.class_id
WHERE
  users.id = $1;

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

-- name: CreateInviteCode :one
INSERT INTO
  invite_codes (code, created_by)
VALUES
  (
    $1,
    $2
  ) RETURNING *;

-- name: CreatePlayer :one
INSERT INTO
  users (name, invite_code_id, race_id, class_id)
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
  ) RETURNING *;
