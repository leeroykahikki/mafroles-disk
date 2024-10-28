const { Token } = require('../utils/db');

// проверить не удалён ли пользователь
module.exports = async function (req, res, next) {
  if (req.method === 'OPTIONS') {
    next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer asfasnfkajsfnjk

    console.log(`[REQUEST] TOKEN: ${token}`);

    if (!token) {
      сonsole.log('[ACCESS DENIED] Ошибка: Не авторизован');
      return res.status(401).json({ message: '[ACCESS DENIED] Ошибка: Не авторизован' });
    }

    const tokenDB = await Token.findOne({ Token: token });

    if (!tokenDB) {
      console.log(`[ACCESS DENIED] Ошибка: Токен не найден | TOKEN: ${token}`);
      return res.status(401).json({ message: `[ACCESS DENIED] Ошибка: Токен не найден` });
    }

    console.log(`[ACCESS ALLOWED] NAME: ${tokenDB.Name} | TOKEN: ${tokenDB.Token}`);

    next();
  } catch (e) {
    console.log('[ACCESS DENIED] Ошибка: Непредвиденный сбой');
    res.status(401).json({ message: '[ACCESS DENIED] Ошибка: Непредвиденный сбой' });
  }
};
