import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const getPlayersQuery = `-- name: GetPlayers :many
SELECT
  id, name, email, "emailVerified", image, race_id, class_id, invite_code_id
FROM
  users`;

export interface GetPlayersRow {
    id: number;
    name: string | null;
    email: string | null;
    emailverified: Date | null;
    image: string | null;
    raceId: number | null;
    classId: number | null;
    inviteCodeId: number | null;
}

export async function getPlayers(client: Client): Promise<GetPlayersRow[]> {
    const result = await client.query({
        text: getPlayersQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            email: row[2],
            emailverified: row[3],
            image: row[4],
            raceId: row[5],
            classId: row[6],
            inviteCodeId: row[7]
        };
    });
}

export const getPlayerByIdQuery = `-- name: GetPlayerById :one
SELECT
  id, name, email, "emailVerified", image, race_id, class_id, invite_code_id
FROM
  users
WHERE
  id = $1`;

export interface GetPlayerByIdArgs {
    id: number;
}

export interface GetPlayerByIdRow {
    id: number;
    name: string | null;
    email: string | null;
    emailverified: Date | null;
    image: string | null;
    raceId: number | null;
    classId: number | null;
    inviteCodeId: number | null;
}

export async function getPlayerById(client: Client, args: GetPlayerByIdArgs): Promise<GetPlayerByIdRow | null> {
    const result = await client.query({
        text: getPlayerByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        email: row[2],
        emailverified: row[3],
        image: row[4],
        raceId: row[5],
        classId: row[6],
        inviteCodeId: row[7]
    };
}

export const consumeInviteCodeQuery = `-- name: ConsumeInviteCode :exec
UPDATE invite_codes
SET
  used_at = CURRENT_TIMESTAMP
WHERE
  code = $1
  AND used_at IS NULL`;

export interface ConsumeInviteCodeArgs {
    code: string;
}

export async function consumeInviteCode(client: Client, args: ConsumeInviteCodeArgs): Promise<void> {
    await client.query({
        text: consumeInviteCodeQuery,
        values: [args.code],
        rowMode: "array"
    });
}

export const getPlayerByInviteCodeQuery = `-- name: GetPlayerByInviteCode :one
SELECT
  id, name, email, "emailVerified", image, race_id, class_id, invite_code_id
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
  )`;

export interface GetPlayerByInviteCodeArgs {
    code: string;
}

export interface GetPlayerByInviteCodeRow {
    id: number;
    name: string | null;
    email: string | null;
    emailverified: Date | null;
    image: string | null;
    raceId: number | null;
    classId: number | null;
    inviteCodeId: number | null;
}

export async function getPlayerByInviteCode(client: Client, args: GetPlayerByInviteCodeArgs): Promise<GetPlayerByInviteCodeRow | null> {
    const result = await client.query({
        text: getPlayerByInviteCodeQuery,
        values: [args.code],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        email: row[2],
        emailverified: row[3],
        image: row[4],
        raceId: row[5],
        classId: row[6],
        inviteCodeId: row[7]
    };
}

export const deletePlayerQuery = `-- name: DeletePlayer :exec
DELETE FROM users
WHERE
  id = $1`;

export interface DeletePlayerArgs {
    id: number;
}

export async function deletePlayer(client: Client, args: DeletePlayerArgs): Promise<void> {
    await client.query({
        text: deletePlayerQuery,
        values: [args.id],
        rowMode: "array"
    });
}

export const setPlayerRaceQuery = `-- name: SetPlayerRace :exec
UPDATE users
SET
  race_id = $1
WHERE
  id = $2`;

export interface SetPlayerRaceArgs {
    raceId: number | null;
    id: number;
}

export async function setPlayerRace(client: Client, args: SetPlayerRaceArgs): Promise<void> {
    await client.query({
        text: setPlayerRaceQuery,
        values: [args.raceId, args.id],
        rowMode: "array"
    });
}

export const setPlayerClassQuery = `-- name: SetPlayerClass :exec
UPDATE users
SET
  class_id = $1
WHERE
  id = $2`;

export interface SetPlayerClassArgs {
    classId: number | null;
    id: number;
}

export async function setPlayerClass(client: Client, args: SetPlayerClassArgs): Promise<void> {
    await client.query({
        text: setPlayerClassQuery,
        values: [args.classId, args.id],
        rowMode: "array"
    });
}

export const getPlayerRaceQuery = `-- name: GetPlayerRace :one
SELECT
  races.name,
  races.slug
FROM
  users
  INNER JOIN races ON races.id = users.race_id
WHERE
  users.id = $1`;

export interface GetPlayerRaceArgs {
    id: number;
}

export interface GetPlayerRaceRow {
    name: string;
    slug: string;
}

export async function getPlayerRace(client: Client, args: GetPlayerRaceArgs): Promise<GetPlayerRaceRow | null> {
    const result = await client.query({
        text: getPlayerRaceQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        name: row[0],
        slug: row[1]
    };
}

export const getPlayerClassQuery = `-- name: GetPlayerClass :one
SELECT
  classes.name,
  classes.slug
FROM
  users
  INNER JOIN classes ON classes.id = users.class_id
WHERE
  users.id = $1`;

export interface GetPlayerClassArgs {
    id: number;
}

export interface GetPlayerClassRow {
    name: string;
    slug: string;
}

export async function getPlayerClass(client: Client, args: GetPlayerClassArgs): Promise<GetPlayerClassRow | null> {
    const result = await client.query({
        text: getPlayerClassQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        name: row[0],
        slug: row[1]
    };
}

export const getRacesQuery = `-- name: GetRaces :many
SELECT
  id, name, slug
FROM
  races`;

export interface GetRacesRow {
    id: number;
    name: string;
    slug: string;
}

export async function getRaces(client: Client): Promise<GetRacesRow[]> {
    const result = await client.query({
        text: getRacesQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            slug: row[2]
        };
    });
}

export const getClassesQuery = `-- name: GetClasses :many
SELECT
  id, name, slug
FROM
  classes`;

export interface GetClassesRow {
    id: number;
    name: string;
    slug: string;
}

export async function getClasses(client: Client): Promise<GetClassesRow[]> {
    const result = await client.query({
        text: getClassesQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            name: row[1],
            slug: row[2]
        };
    });
}

export const getInviteCodeQuery = `-- name: GetInviteCode :one
SELECT
  id, code, created_by, created_at, used_at
FROM
  invite_codes
WHERE
  code = $1`;

export interface GetInviteCodeArgs {
    code: string;
}

export interface GetInviteCodeRow {
    id: number;
    code: string;
    createdBy: number;
    createdAt: Date | null;
    usedAt: Date | null;
}

export async function getInviteCode(client: Client, args: GetInviteCodeArgs): Promise<GetInviteCodeRow | null> {
    const result = await client.query({
        text: getInviteCodeQuery,
        values: [args.code],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        code: row[1],
        createdBy: row[2],
        createdAt: row[3],
        usedAt: row[4]
    };
}

export const createInviteCodeQuery = `-- name: CreateInviteCode :one
INSERT INTO
  invite_codes (code, created_by)
VALUES
  (
    $1,
    $2
  ) RETURNING id, code, created_by, created_at, used_at`;

export interface CreateInviteCodeArgs {
    code: string;
    createdBy: number;
}

export interface CreateInviteCodeRow {
    id: number;
    code: string;
    createdBy: number;
    createdAt: Date | null;
    usedAt: Date | null;
}

export async function createInviteCode(client: Client, args: CreateInviteCodeArgs): Promise<CreateInviteCodeRow | null> {
    const result = await client.query({
        text: createInviteCodeQuery,
        values: [args.code, args.createdBy],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        code: row[1],
        createdBy: row[2],
        createdAt: row[3],
        usedAt: row[4]
    };
}

export const createPlayerQuery = `-- name: CreatePlayer :one
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
  ) RETURNING id, name, email, "emailVerified", image, race_id, class_id, invite_code_id`;

export interface CreatePlayerArgs {
    name: string | null;
    code: string;
    raceId: number | null;
    classId: number | null;
}

export interface CreatePlayerRow {
    id: number;
    name: string | null;
    email: string | null;
    emailverified: Date | null;
    image: string | null;
    raceId: number | null;
    classId: number | null;
    inviteCodeId: number | null;
}

export async function createPlayer(client: Client, args: CreatePlayerArgs): Promise<CreatePlayerRow | null> {
    const result = await client.query({
        text: createPlayerQuery,
        values: [args.name, args.code, args.raceId, args.classId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        name: row[1],
        email: row[2],
        emailverified: row[3],
        image: row[4],
        raceId: row[5],
        classId: row[6],
        inviteCodeId: row[7]
    };
}

