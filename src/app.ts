const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
import { router } from './routes/index';

require('dotenv').config();

export const app = express();

const PORT = 8000;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use('/', router);

app.listen(PORT, () => {
	console.log(`API started at port ${PORT}`);
});
