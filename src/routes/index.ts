import { Router } from 'express';
const { Pool } = require('pg');
const gerarQueries = require('./gerarQueries');

export const router = Router();

const pool = new Pool({
	connectionString:
		'postgres://gvqvdmbuywnlce:441a4a6da353e75c371635e672c976f94ca61793bac253d5dfd59d29df56693a@ec2-52-73-155-171.compute-1.amazonaws.com:5432/d2p62pk2ajr9i2',
	ssl: {
		rejectUnauthorized: false,
	},
});

router.get('/', (req, res) => res.send('API com Express e TS'));

router.get('/users', async (req, res) => {
	try {
		const { rows } = await pool.query(gerarQueries.gerarQuerySelectUser());
		console.log('rows', rows);
		return res.status(200).send(rows);
	} catch (err) {
		console.error(err);
		return res.status(400).send(err);
	}
});
