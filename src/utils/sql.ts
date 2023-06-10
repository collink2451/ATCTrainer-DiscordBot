export const CREATE_USER_TABLE_SQL = `CREATE TABLE IF NOT EXISTS user (
    vatsim_cid TEXT PRIMARY KEY,
    discord_id TEXT
);`;

export const ADD_USER_SQL = (vatsimCid: string, discordId: string) => `INSERT INTO user (vatsim_cid, discord_id)
VALUES ('${vatsimCid}', '${discordId}')
ON CONFLICT(vatsim_cid) DO UPDATE SET discord_id = '${discordId}';`;

export const GET_ALL_USERS_SQL = `SELECT * FROM user;`;

export const REMOVE_USER_SQL = (vatsimCid: string) => `DELETE FROM user
WHERE vatsim_cid = '${vatsimCid}';`;
