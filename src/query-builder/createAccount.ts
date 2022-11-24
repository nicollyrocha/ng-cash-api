

export function selectAccounts() {
  const query = `SELECT id FROM node_typeorm.accounts
    ORDER BY id DESC
    FETCH FIRST 1 ROWS ONLY`;

  return query;
}