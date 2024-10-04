const axios = require('axios');
const ApiError = require('../error/ApiError');

axios.defaults.headers.common['Authorization'] = process.env.DISK_TOKEN;

const limit = 200;

class DiskController {
  async getTournaments(req, res, next) {
    let data;

    const fields = ['_embedded.items.name', '_embedded.items.path', '_embedded.items.type'].join(
      ',',
    );

    try {
      await axios
        .get(process.env.DISK_URL, {
          params: {
            path: process.env.DISK_PATH + '/photo',
            fields,
            limit,
          },
        })
        .then((response) => {
          data = response.data;
        })
        .catch((error) => {
          console.error('[Запрос] Ошибка:', error.message);
        });
    } catch (error) {
      console.error('[Сервер] Ошибка:', error.message);
      return next(ApiError.badRequest('Произошла ошибка во время запроса к диску'));
    }

    try {
      if (Object.keys(data).length === 0) {
        console.error('[Сервер] Ошибка:', 'Пустой объект с турнирами');
        return next(ApiError.badRequest('Данные о турнирах не были получены'));
      }
    } catch (error) {
      console.error('[Сервер] Ошибка:', error.message);
      return next(ApiError.badRequest('Данные о турнирах не были получены'));
    }

    const tournamentsRaw = data._embedded.items.filter((element) => {
      return element.type === 'dir';
    });

    const tournaments = tournamentsRaw.map((tournamentRaw) => {
      const tournament = {
        name: tournamentRaw.name,
        path: tournamentRaw.path,
      };

      return tournament;
    });

    return res.json(tournaments);
  }

  async getPlayers(req, res, next) {
    const { path } = req.query;

    let data;

    const fields = ['_embedded.items.name', '_embedded.items.type', '_embedded.items.sizes'].join(
      ',',
    );

    try {
      await axios
        .get(process.env.DISK_URL, {
          params: {
            path,
            fields,
            limit,
          },
        })
        .then((response) => {
          data = response.data;
        })
        .catch((error) => {
          console.error('[Запрос] Ошибка:', error.message);
        });
    } catch (error) {
      console.error('[Сервер] Ошибка:', error.message);
      return next(ApiError.badRequest('Произошла ошибка во время запроса к диску'));
    }

    try {
      if (Object.keys(data).length === 0) {
        console.error('[Сервер] Ошибка:', 'Пустой объект с игроками');
        return next(ApiError.badRequest('Данные о игроках не были получены'));
      }
    } catch (error) {
      console.error('[Сервер] Ошибка:', error.message);
      return next(ApiError.badRequest('Данные о игроках не были получены'));
    }

    const playersRaw = data._embedded.items.filter((element) => {
      return element.type === 'file';
    });

    const players = playersRaw.map((playerRaw) => {
      const player = {
        name: playerRaw.name.replace(/\.[^/.]+$/, ''),
        image: playerRaw.sizes.find((img) => img.name === 'ORIGINAL').url,
      };

      return player;
    });

    return res.json(players);
  }

  async getDefaultImages(req, res, next) {
    const fields = ['_embedded.items.name, _embedded.items.sizes'].join(',');

    let data;

    try {
      await axios
        .get(process.env.DISK_URL, {
          params: {
            path: process.env.DISK_PATH + '/default',
            fields,
          },
        })
        .then((response) => {
          data = response.data;
        })
        .catch((error) => {
          console.error('[Запрос] Ошибка:', error.message);
        });
    } catch (error) {
      console.error('[Сервер] Ошибка:', error.message);
      return next(ApiError.badRequest('Произошла ошибка во время запроса к диску'));
    }

    try {
      if (Object.keys(data).length === 0) {
        console.error('[Сервер] Ошибка:', 'Пустой объект с фотографиями');
        return next(ApiError.badRequest('Данные о фотографиях не были получены'));
      }
    } catch (error) {
      console.error('[Сервер] Ошибка:', error.message);
      return next(ApiError.badRequest('Данные о фотографиях не были получены'));
    }

    const defaultImages = {
      civil: data._embedded.items[0].sizes.find((img) => img.name === 'ORIGINAL').url,
      mafia: data._embedded.items[1].sizes.find((img) => img.name === 'ORIGINAL').url,
    };

    return res.json(defaultImages);
  }
}

module.exports = new DiskController();
