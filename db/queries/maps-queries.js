const db = require('../../server');

// Gets a list of all available maps
const getAllMapsAnon = () => {
  return db.query(`
    SELECT maps.name AS map_name, TO_CHAR(maps.date_created::date, 'Mon dd, yyyy') AS map_created,
    users.name AS created_by, TRUNC(AVG(fav_maps.rating)) AS rating, MIN(pins.image_url) AS img_url
    FROM maps
    JOIN users ON maps.user_id = users.id
    JOIN fav_maps ON fav_maps.map_id = maps.id
    JOIN pins ON pins.map_id = maps.id
    GROUP BY maps.id, users.name, pins.image_url
    ORDER BY maps.date_created DESC;`
  )
    .then(response => response.rows)
    .catch(err => err);
};
// Gets a list of top rated maps
const getTopRated = () => {
  return db.query(`
    SELECT maps.name AS map_name, TO_CHAR(maps.date_created::date, 'Mon dd, yyyy') AS map_created,
    users.name AS created_by, TRUNC(AVG(fav_maps.rating)) AS rating, MIN(pins.image_url) AS img_url
    FROM maps
    JOIN users ON maps.user_id = users.id
    JOIN fav_maps ON fav_maps.map_id = maps.id
    JOIN pins ON pins.map_id = maps.id
    GROUP BY maps.id, users.name, pins.image_url
    ORDER BY rating DESC
    LIMIT 5;`
  )
    .then(response => response.rows)
    .catch(err => err);
};
// Gets a list of all maps by creator
const getAllMapsByUser = (userName) => {
  return db.query(`
    SELECT maps.id AS map_id, maps.name AS map_name, maps.date_created AS map_created, users.name AS created_by, MIN(pins.image_url) AS img_url
    FROM maps
    JOIN users ON maps.user_id = users.id
    JOIN pins ON pins.map_id = maps.id
    WHERE users.name = $1
    GROUP BY maps.id, users.name, pins.image_url
    ORDER BY map_created DESC;`, [userName]
  )
    .then(response => response.rows)
    .catch(err => err);
  };
  // Gets a map by map_id
  const getMapsByID = (mapID) => {
    return db.query(`
    SELECT maps.id AS map_id, maps.name AS map_name, maps.date_created AS map_created, users.name AS created_by, MIN(pins.image_url) AS img_url
    FROM maps
    JOIN users ON maps.user_id = users.id
    JOIN pins ON pins.map_id = maps.id
    WHERE maps.id = $1
    GROUP BY maps.id, users.name, pins.image_url;`, [mapID]
  )
    .then(response => response.rows)
    .catch(err => err);
};
// Gets a specific map of pins by map_id
const getMapOfPinsByID = (mapID) => {
  return db.query(`
    SELECT maps.id AS map_id, maps.name AS map_name, maps.date_created AS map_created, users.name AS created_by,
    pins.id AS pin_id, pins.lat AS pin_lat, pins.lng AS pin_lng, pins.title AS pin_title, pins.description AS pin_description, MIN(pins.image_url) AS img_url
    FROM maps
    JOIN users ON maps.user_id = users.id
    JOIN pins ON maps.id = pins.map_id
    WHERE maps.id = $1
    GROUP BY maps.id, users.name, pins.id, pins.image_url
    ORDER BY pin_id;`, [mapID]
  )
    .then(response => response.rows)
    .catch(err => err);
};
// Save new map to database
const createNewMap = (userID, mapName) => {
  return db.query(`
  INSERT INTO maps (name, user_id, date_created)
  VALUES ($1, $2, current_timestamp) RETURNING maps.id;
  `, [mapName, userID])
    .then(response => response.rows[0])
    .catch(err => err);
};

//EXPORT FUNCTIONS
module.exports = {
  getAllMapsAnon,
  getTopRated,
  getAllMapsByUser,
  getMapsByID,
  getMapOfPinsByID,
  createNewMap
};
