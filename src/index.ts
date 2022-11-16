import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
const { Pool } = require('pg');
const gerarQueries = require('./gerarQueries');
require('dotenv').config();

const pool = new Pool({
	connectionString:
		'postgres://gvqvdmbuywnlce:441a4a6da353e75c371635e672c976f94ca61793bac253d5dfd59d29df56693a@ec2-52-73-155-171.compute-1.amazonaws.com:5432/d2p62pk2ajr9i2',
	ssl: {
		rejectUnauthorized: false,
	},
});

const app = express();

const PORT = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
	return res.json('Oi');
});

app.get('/users', async (req, res) => {
	try {
		const { rows } = await pool.query(gerarQueries.gerarQuerySelectAllUsers());

		return res.status(200).send(rows);
	} catch (err) {
		console.error(err);
		return res.status(400).send(err);
	}
});

app.listen(PORT, () => {
	console.log(`API started at port ${PORT}`);
});
