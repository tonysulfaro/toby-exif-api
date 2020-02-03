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
  .use(fileUpload({
    useTempFiles: true,
    temoFIleDir: '/tmp/',
    createParentPath: true
  }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/cords', cors(), function (req, res) {
    // res.send(console.dir(req.files))
    console.log(req)
    console.log('now time for walleye image')

    try {
      ExifImage({ image: 'walleye.jpg' }, function (error, exifData) {
        if (error) {
          console.log('Error: ' + error.message)
        }
        else {
          console.log(exifData) // Do something with your data!
          res.send(exifData)
        }
      })
    } catch (error) {
      console.log('Error: ' + error.message)
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT}`))
