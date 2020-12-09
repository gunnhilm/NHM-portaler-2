const path = require('path')
const express = require('express')
const fileRead = require('./utils/fileread')
const getStatFile = require('./utils/getStatFile')
//const coremaFileread = require('./utils/coremaFileread')
const footerDate = require('./utils/footerDate')
const hbs = require('hbs')
const helmet = require('helmet')
// const request = require('request') // move to fileread
const fs = require ('fs') // move to fileread


const app = express()

// Sikkerhets app som beskytter mot uønskede headers osv.
app.use(helmet())
const port = process.env.PORT || 3000
    

// define paths for Express
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set up handelsbars engine and views location
app.set('view engine' , 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// set up static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    if (!req.query.search) {
        return res.render('index', {
        })
    } else {
        fileRead.search(req.query.search, (error, results) => {
            res.render('index', {
                results: results
             })
         })
    }
})

// Søk er treff i MUSIT-dump fila
// input:
//  req.query.samling = samling fra dropdown
//  req.query.search = søke ordene
//  req.query.linjeNumber = linja søk vi skal søke videre fra, er = 0 hvis det er et nytt søk
//   req.query.limit = antallet søkeresultater som skal sendes tilbake
//  (error, results) callback med resultatene fra søket

app.get('/search', (req, res) => {
    if (!req.query.samling) {
        throw new Error ('collection not chosen') 
    } else {
        try {
            fileRead.search(req.query.samling, req.query.search, req.query.linjeNumber,req.query.limit , (error, results) => {
                res.send({
                    unparsed: results
                })
            })
        }
        catch(error) {
            throw new Error ('error in fileread.js ' + error)
        }
    }
})

// for å laste ned søkeresultatene
// app.get('/download', (req, res) => {
//     console.log("i app download")
//     if (!req.query.search) {
//         return res.send({
//             error: 'ingen data å laste ned'
//         })
//     } else {

//         fileRead.search(req.query.samling, req.query.search, req.query.linjeNumber,req.query.limit, (error, results) => {

            
//             if (results){
//                  res.send({
//                     unparsed: results
//                 }) 
              
//             } else {
//                 console.log('Error: no results came back from seach')
//             }
//         })
//     }
// })

// to download image(s)
// app.get('/downloadImage', (req, res) => {
//     console.log(req.query)
//     if (!req.query.search) {
//         console.log('feil?')
//         return res.send({
//             error: 'ingen bilder å laste ned'
//         })
//     }
//      else {
//          console.log('app-image-download')
//         const url = 'http://www.unimus.no/felles/bilder/web_hent_bilde.php?id=13254255&type=jpeg'
//         const path = './images/image.jpg' 
//         downloadImage(url, path, () => {
//             console.log('✅ Done!')
//           })
        
//     }
// })

// // move to fileRead
// const downloadImage = (url, path, callback) => {
//     request.head(url, (err, res, body) => {
//       request(url)
//         .pipe(fs.createWriteStream(path))
//         .on('close', callback)
//     })
//   }
  
 
// footer date get
app.get('/footer-date', (req, res) => {
    if (req) {
        footerDate.getFileUpdatedDate(req.query.samling, (error, date) => {
            if (error) {
                return
            } else {
                res.send({
                    date: date
                }) 
            }
        })
    }
 })


// objektvisningen
app.get('/object', (req, res) => {
    if (!req.query.id) {
        return res.send({
            error: 'Du må oppgi et objekt'
        }) 
    } else {
        res.render('object', {
            myObject: req.query.id
        })
    }
})



app.get('/showStat', (req, res) => {
    if (!req.query.getStat) {
        return res.render('showStat', {
        })
    } else {
    getStatFile.getStatData('dummy', (error, results) => {
        if (results){
            res.send({
                unparsed: results
            }) 
          
        } else {
            console.log('Error: cold not read statdata file')
        }
    })
    }
})
 
// journal siden
app.get('/journaler', (req, res) => {
    res.render('journaler', {
     })
 })


app.get('/about', (req, res) => {
   res.render('about', {
    })
})

app.get('/help', (req, res) => {
    res.render('help', {})
})

app.get('/map', (req, res) => {
    res.render('map', {})
})

app.get('/mapObject', (req, res) => {
    res.render('mapObject', {})
})

app.get('/getDOI', (req, res) => {
    res.render('getDOI', {})
})

app.get('*', (req, res) => {
    res.render('404', {})
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})