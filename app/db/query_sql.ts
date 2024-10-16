import mysql, { RowDataPacket } from "mysql2/promise";

type Client = mysql.Connection | mysql.Pool;

export const getPlayersQuery = `-- name: GetPlayers :many
SELECT
  id, username, invite_code_id, race_id, class_id, created_at
FROM
  players`;

export interface GetPlayersRow {
    id: number;
    username: string;
    inviteCodeId: number | null;
    raceId: number | null;
    classId: number | null;
    createdAt: Date | null;
}

export async function getPlayers(client: Client): Promise<GetPlayersRow[]> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getPlayersQuery,
        values: [],
        rowsAsArray: true
    });
    return rows.map(row => {
        return {
            id: row[0],
            username: row[1],
            inviteCodeId: row[2],
            raceId: row[3],
            classId: row[4],
            createdAt: row[5]
        };
    });
}

export const getPlayerByIdQuery = `-- name: GetPlayerById :one
SELECT
  id, username, invite_code_id, race_id, class_id, created_at
FROM
  players
WHERE
  id = ?`;

export interface GetPlayerByIdArgs {
    id: number;
}

export interface GetPlayerByIdRow {
    id: number;
    username: string;
    inviteCodeId: number | null;
    raceId: number | null;
    classId: number | null;
    createdAt: Date | null;
}

export async function getPlayerById(client: Client, args: GetPlayerByIdArgs): Promise<GetPlayerByIdRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getPlayerByIdQuery,
        values: [args.id],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        username: row[1],
        inviteCodeId: row[2],
        raceId: row[3],
        classId: row[4],
        createdAt: row[5]
    };
}

export const consumeInviteCodeQuery = `-- name: ConsumeInviteCode :exec
UPDATE invite_codes
SET
  used_at = CURRENT_TIMESTAMP
WHERE
  code = ?
  AND used_at IS NULL`;

export interface ConsumeInviteCodeArgs {
    code: string;
}

export async function consumeInviteCode(client: Client, args: ConsumeInviteCodeArgs): Promise<void> {
    await client.query({
        sql: consumeInviteCodeQuery,
        values: [args.code]
    });
}

export const getPlayerByInviteCodeQuery = `-- name: GetPlayerByInviteCode :one
SELECT
  id, username, invite_code_id, race_id, class_id, created_at
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
  )`;

export interface GetPlayerByInviteCodeArgs {
    code: string;
}

export interface GetPlayerByInviteCodeRow {
    id: number;
    username: string;
    inviteCodeId: number | null;
    raceId: number | null;
    classId: number | null;
    createdAt: Date | null;
}

export async function getPlayerByInviteCode(client: Client, args: GetPlayerByInviteCodeArgs): Promise<GetPlayerByInviteCodeRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getPlayerByInviteCodeQuery,
        values: [args.code],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        username: row[1],
        inviteCodeId: row[2],
        raceId: row[3],
        classId: row[4],
        createdAt: row[5]
    };
}

export const createPlayerQuery = `-- name: CreatePlayer :execresult
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
  )`;

export interface CreatePlayerArgs {
    username: string;
    code: string;
    raceId: number | null;
    classId: number | null;
}

export const deletePlayerQuery = `-- name: DeletePlayer :exec
DELETE FROM players
WHERE
  id = ?`;

export interface DeletePlayerArgs {
    id: number;
}

export async function deletePlayer(client: Client, args: DeletePlayerArgs): Promise<void> {
    await client.query({
        sql: deletePlayerQuery,
        values: [args.id]
    });
}

export const setPlayerRaceQuery = `-- name: SetPlayerRace :exec
UPDATE players
SET
  race_id = ?
WHERE
  id = ?`;

export interface SetPlayerRaceArgs {
    raceId: number | null;
    id: number;
}

export async function setPlayerRace(client: Client, args: SetPlayerRaceArgs): Promise<void> {
    await client.query({
        sql: setPlayerRaceQuery,
        values: [args.raceId, args.id]
    });
}

export const setPlayerClassQuery = `-- name: SetPlayerClass :exec
UPDATE players
SET
  class_id = ?
WHERE
  id = ?`;

export interface SetPlayerClassArgs {
    classId: number | null;
    id: number;
}

export async function setPlayerClass(client: Client, args: SetPlayerClassArgs): Promise<void> {
    await client.query({
        sql: setPlayerClassQuery,
        values: [args.classId, args.id]
    });
}

export const getPlayerRaceQuery = `-- name: GetPlayerRace :one
SELECT
  races.name,
  races.slug
FROM
  players
  INNER JOIN races ON races.id = players.race_id
WHERE
  players.id = ?`;

export interface GetPlayerRaceArgs {
    id: number;
}

export interface GetPlayerRaceRow {
    name: string;
    slug: string;
}

export async function getPlayerRace(client: Client, args: GetPlayerRaceArgs): Promise<GetPlayerRaceRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getPlayerRaceQuery,
        values: [args.id],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
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
  players
  INNER JOIN classes ON classes.id = players.class_id
WHERE
  players.id = ?`;

export interface GetPlayerClassArgs {
    id: number;
}

export interface GetPlayerClassRow {
    name: string;
    slug: string;
}

export async function getPlayerClass(client: Client, args: GetPlayerClassArgs): Promise<GetPlayerClassRow | null> {
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getPlayerClassQuery,
        values: [args.id],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
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
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getRacesQuery,
        values: [],
        rowsAsArray: true
    });
    return rows.map(row => {
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
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getClassesQuery,
        values: [],
        rowsAsArray: true
    });
    return rows.map(row => {
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
  code = ?`;

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
    const [rows] = await client.query<RowDataPacket[]>({
        sql: getInviteCodeQuery,
        values: [args.code],
        rowsAsArray: true
    });
    if (rows.length !== 1) {
        return null;
    }
    const row = rows[0];
    return {
        id: row[0],
        code: row[1],
        createdBy: row[2],
        createdAt: row[3],
        usedAt: row[4]
    };
}

