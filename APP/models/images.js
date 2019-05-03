// Model of the images

const db = require('../util/database');

class Images {
    // Insert an image into the database
    static create(userId, name) {
        return(db.execute('INSERT INTO t_image(image_path, image_idUser) VALUES (?, ?);', [name, userId]));
    }

    // Delete all the images from an user
    static deleteAll(userId) {
        return(db.execute('DELETE FROM t_image WHERE image_idUser = ?;', [userId]));
    }
}

module.exports = Images;
