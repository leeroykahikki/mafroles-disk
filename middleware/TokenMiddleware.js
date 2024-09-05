const { Token } = require('../utils/db');

// проверить не удалён ли пользователь
module.exports = async function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer asfasnfkajsfnjk

    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    const tokenDB = await Token.findOne({ Token: token });

    if (!tokenDB) {
      return res.status(401).json({ message: 'Токен не найден' });
    }

    next();
  } catch (e) {
    res.status(401).json({ message: 'Не авторизован' });
  }
};
