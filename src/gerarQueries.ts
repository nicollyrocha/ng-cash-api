function gerarQuerySelectAllUsers() {
	const query = `SELECT * FROM accounts WHERE id = 1`;

	return query;
}

module.exports = {
	gerarQuerySelectAllUsers: gerarQuerySelectAllUsers,
};
