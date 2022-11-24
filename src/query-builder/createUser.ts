export function createUserQuery(username: string, password: string){
    const query = `INSERT INTO users(username, password) VALUES ('${username}', '${password}')`;

  return query;
}