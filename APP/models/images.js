// Model of the images

const db = require('../util/database');

class Images {
    // Insert an image into the database
    static create(userId, name) {
        return(db.execute('INSERT INTO t_image(image_path, image_idUser) VALUES (?, ?);', [name, userId]));
    }
}

module.exports = Images;
