const multer = require('multer');
const uuid = require('uuidv4');

//SET STORAGE
var storage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, './public/uploads');
  },
  filename: async function(req, file, callback) {
    var name = uuid() + '.' + file.originalname.split('.').pop();

    callback(null, name);

    return name;
  },
});

//SET size and storage for a file
const upload = multer({
  limits: {
    fieldSize: 4 * 1024 * 1024,
  },
  storage: storage,
});

module.exports = upload;
