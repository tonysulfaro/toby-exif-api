const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
const PORT = process.env.PORT || 5000

const cors = require('cors')
var ExifImage = require('exif').ExifImage

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*')
    res.header("Access-Control-Allow-Credentials", true)
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json')
    next()
  })
  .use(fileUpload())
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/cords', cors(), function (req, res) {
    // res.send(console.dir(req.files))
    console.log(req)
    console.log('now time for walleye image')

    let sampleFile;
    let uploadPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send('No files were uploaded.');
      return;
    }

    console.log('req.files >>>', req.files); // eslint-disable-line

    sampleFile = req.files.sampleFile;
    uploadPath = __dirname + '/uploads/' + sampleFile.name;

    sampleFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      // res.send('File uploaded to ' + uploadPath);
    });
  
    // send exif response
    try {
      ExifImage({ image: uploadPath}, function (error, exifData) {
        if (error) {
          console.log('Error: ' + error.message)
          res.send(400, error.message)
        }
        else {
          console.log(exifData) // Do something with your data!
          res.send(exifData)
        }
      })
    } catch (error) {
      console.log('Error: ' + error.message)
      res.send(400, error.message)
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT}`))
