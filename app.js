const path = require('path')
const express = require('express')
const fileRead = require('./utils/fileread')
const getStatFile = require('./utils/getStatFile')
const checkCoord = require('./utils/checkCoords')
//const coremaFileread = require('./utils/coremaFileread')
const footerDate = require('./utils/footerDate')
const hbs = require('hbs')
const helmet = require('helmet')
const { response } = require('express')





const app = express()

// Sikkerhets app som beskytter mot uønskede headers osv.
app.use(helmet())
const port = process.env.PORT || 3000
    

// define paths for Express
const publicDirectoryPath = path.join(__dirname, '../public')
const publicJournalPath = path.join(__dirname, '../src/data/journaler')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set up handelsbars engine and views location
app.set('view engine' , 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// set up static directory to serve
app.use(express.static(publicDirectoryPath))
app.use(express.static(publicJournalPath))

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

app.get('/nhm', (req, res) => {
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
app.get('/tmu', (req, res) => {
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
app.get('/um', (req, res) => {
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

app.get('/nbh', (req, res) => {
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
            fileRead.search(req.query.museum, req.query.samling, req.query.search, req.query.linjeNumber,req.query.limit , (error, results) => {
                res.send({
                    unparsed: results
                })
            })
        }
        catch(error) {
            console.log('error in fileread.js ' + error)
            throw new Error ('File not found ')
        }
    }
})

app.get('/orgGroups', (req, res) => {
    if (!req.query.museum) {
        throw new Error ('no museum...')
    } else {
        try {
            let orgGroup = fileRead.setOrgGroups(req.query.museum, (error, results) => {

            })
            res.send(orgGroup)
        }
        catch(error) {
            console.log(error)
            throw new Error ('feil i app.js')
        }
    }

})
app.get('/collections', (req, res) => {
    if (!req.query.museum) {
        throw new Error ('no museum...')
    }else {
        try {
            let coll = fileRead.setSubcollections(req.query.museum, req.query.orgGroup, (error, results) => {
            })
            res.send(coll)
        }
        catch(error) {
            console.log(error)
            throw new Error ('feil app.js linje 120')
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

// // to download image(s)
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
        footerDate.getFileUpdatedDate(req.query.museum, req.query.samling, (error, date) => {
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
app.get('*/object', (req, res) => {
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

app.get('*/tools', (req, res) => {
    res.render('tools', {
    })
})


app.get('*/showStat', (req, res) => {
    if (!req.query.getStat) {
            return res.render('showStat', {
        })
    } else {
        getStatFile.getStatData('dummy', req.query.museum, (error, results) => {
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
app.get('/nhm/journaler', (req, res) => {
    res.render('journaler', {
     })
 })


app.get('/about', (req, res) => {
   res.render('about', {
    })
})

app.get('*/help', (req, res) => {
    res.render('help', {})
})

app.get('*/map', (req, res) => {
    res.render('map', {})
})

app.get('*/mapObject', (req, res) => {
    res.render('mapObject', {})
})

app.get('*/getDOI', (req, res) => {
    res.render('getDOI', {})
})

// tool-page for checking if coordinates are within correct region
app.get('*/checkCoord', (req, res) => {
    if (!req.query.museum) {
        return res.render('checkCoord', {
        })
    } else if (req.query.download) {
        console.log('vi starter download');
        const filePath = 'src/data/' + req.query.museum + '/geoError/' + req.query.download
        console.log(filePath);
        res.download(filePath)
    } else {
        checkCoord.startUp(req, (error, results) => {
            if(error){
                console.log(error);
            } else {
                res.send({
                    results: results
                })
            }
        })
    }
})

// tool-page for getting error from GBiF
app.get('*/dataErrors', (req, res) => {
    res.render('dataErrors', {})
})

// tool-page for getting checking dataflow to GBiF and Artsdatabanken
app.get('*/dataFlow', (req, res) => {
    res.render('dataFlow', {})
})

// functionality to check if coordinates are within correct region
app.get('/checkRegion', (req, res) => {
    if (!req.query.regionType) {
        throw new Error ('no region...') 
    } else {
        try {
            fileRead.checkRegion(req.query.regionType, req.query.lat, req.query.long, (error, results) => {
                res.send({
                    unparsed: results
                })
            })
        }
        catch(error) {
            console.log('error in fileread.js ' + error)
            throw new Error ('File not found ')
        }
    }
})




app.get('/checkRegion2', (req, res) => {
    if (!req.query.regionType) {
        console.log('checkRegion-error')
        throw new Error ('regiontype not chosen')
    } else {
        try {
            fileRead.checkRegion2(req.query.regionType, req.query.lat, req.query.long, (error, results) => {
                res.send({
                    unparsed: results
                })
            })
        }
        catch(error) {
            console.log('error in checkregion.js' + error)
            throw new Error ('something is wrong')
        }
    }
})
    
    
app.get('*', (req, res) => {
    res.render('404', {})
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})