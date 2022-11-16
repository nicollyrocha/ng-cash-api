function gerarQuerySelectAllUsers() {
  const query = `SELECT * FROM user_web`;

  return query;
}

function gerarQuerySelectBooksByUser(username) {
  const query = `SELECT * FROM books WHERE username = '${username}'
  ORDER BY book_id`;

  return query;
}

function gerarQueryRegisterUser(dados, password_hash) {
  const query = `INSERT INTO user_web(username, password) VALUES ('${dados.userName}', '${password_hash}')`;

  return query;
}

function gerarQueryUpdateBook(userName, dados) {
  if (dados.date !== null && dados.status === 'lido') {
    const query = `UPDATE books
                SET 
                status='${dados.status}',
                date_finished='${dados.date}'${
      dados.status === 'lido' &&
      dados.rating !== null &&
      dados.rating !== undefined &&
      dados.rating !== ''
        ? `,
                rating='${dados.rating}'`
        : ''
    }
                WHERE username='${userName}'               
                AND book_id='${dados.book_id}'`;
    return query;
  } else {
    const query = `UPDATE books
                SET 
                status='${dados.status}',
                date_finished=${null}${
      dados.status === 'lido' &&
      dados.rating !== null &&
      dados.rating !== undefined &&
      dados.rating !== ''
        ? `,
                rating='${dados.rating}'`
        : ''
    }
                WHERE username='${userName}'               
                AND book_id='${dados.book_id}'`;
    console.log('a2', query);
    return query;
  }
}

function gerarQueryRegisterBook(dados) {
  let lido = false;
  if (dados.status === 'lido') {
    lido = true;
  } else {
    lido = false;
  }

  const query = `INSERT INTO books(title, author, status, ${
    dados.status === 'lido' &&
    dados.rating !== null &&
    dados.rating !== undefined
      ? 'rating,'
      : ''
  }  username, created_at ${
    dados.date && dados.date !== null ? `, date_finished` : ''
  }) 
  VALUES ('${dados.title}', 
  '${dados.author}', '${dados.status}' ${
    dados.status === 'lido' &&
    dados.rating !== null &&
    dados.rating !== undefined
      ? `, '${dados.rating}' `
      : ''
  } , '${dados.userName}', CURRENT_TIMESTAMP ${
    dados.status === 'lido'
      ? `${dados.date && dados.date !== null ? `, '${dados.date}'` : ''}`
      : ''
  } )`;
  return query;
}

function gerarQueryLogin() {
  const query = `SELECT * FROM user_web`;

  return query;
}

function gerarQueryPassword(userName) {
  const query = `SELECT * FROM user_web WHERE username = '${userName}'
  `;
  return query;
}

function gerarQueryDeleteBook(dados) {
  const query = `DELETE FROM books WHERE
  book_id='${dados.book_id}'
  AND username='${dados.userName}'`;

  return query;
}

module.exports = {
  gerarQuerySelectAllUsers: gerarQuerySelectAllUsers,
  gerarQueryRegisterUser: gerarQueryRegisterUser,
  gerarQueryRegisterBook: gerarQueryRegisterBook,
  gerarQueryLogin: gerarQueryLogin,
  gerarQuerySelectBooksByUser: gerarQuerySelectBooksByUser,
  gerarQueryUpdateBook: gerarQueryUpdateBook,
  gerarQueryDeleteBook: gerarQueryDeleteBook,
  gerarQueryPassword: gerarQueryPassword,
};
