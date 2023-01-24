const path = require('path')
const express = require('express')
const fileRead = require('./utils/fileread')
const getStatFile = require('./utils/getStatFile')
const checkCoord = require('./utils/checkCoords')
const artsObsReadFile = require('./utils/artsobs/artsObs')
const adbAPI2 = require('./utils/artsobs/adbAPI2')
const barcoding = require('./utils/barcoding/barcoding')
const footerDate = require('./utils/footerDate')
const loan = require('./utils/loans/loans') 
const hbs = require('hbs')
const helmet = require('helmet')
const { response } = require('express')
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs')
const readline = require('readline')
const csvParser = require('csv-parser')
const bodyParser = require('body-parser');
// Include Express Validator Functions
const { body, validationResult } = require('express-validator');
const app = express()

// Sikkerhets app som beskytter mot uønskede headers osv.
app.use(helmet())
const port = process.env.PORT || 3000

// reciving json to server
app.use(bodyParser.json());

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


app.get('/advSearch', (req, res) => {
    if (!req.query.samling) {
        throw new Error ('collection not chosen') 
    } else {
        try {
            fileRead.advSearch(req.query.museum, req.query.samling, req.query.searchSpecies, req.query.searchCollector, req.query.searchDate, req.query.searchCountry, req.query.searchCounty, req.query.searchMunicipality, req.query.searchLocality, req.query.searchCollNo, req.query.searchTaxType, req.query.linjeNumber,req.query.limit,req.query.hasPhoto , (error, results) => {
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


app.get('/objListSearch', (req, res) => {
    if (!req.query.samling) {
        throw new Error ('collection not chosen') 
    } else {
        try {
            fileRead.objListSearch(req.query.museum, req.query.samling, req.query.searchObjects,req.query.linjeNumber,req.query.limit , (error, results) => {
                
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

app.get('/getFileList', (req, res) => {
    if (!req.query.museum) {
        throw new Error ('no museum')
    } else {
        try {
            let fileListObject = fileRead.fileListObject(req.query.museum, (error, results) => {
            })
            res.send(fileListObject)
        }
        catch(error) {
            console.log(error)
            throw new Error ('feil i app.js')
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

app.get('/groupOfOrg', (req, res) => {
    if (!req.query.museum || !req.query.samling ) {
        throw new Error ('no museum...or collection..')
    } else {
        try {
            let orgGroup = fileRead.getOrgGroup(req.query.museum, req.query.samling, (error, results) => {
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

app.get('/which', (req,res) => {
    if (!req.query.collection) {
        throw new Error ('no collection')
    } else {
        try {
            let fileDb = fileRead.whichFileDb(req.query.museum, req.query.collection, (error, result) => {
            })
            res.send(fileDb)
        } catch (error) {
            console.log(error)
            throw new Error ('feil app.js. linje 232')
        }
    }
})
 
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


app.get('*/advancedSearch', (req, res) => {
    res.render('advancedSearch', {
     })
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
                console.log('Error: could not read statdata file')
            }
        })
    }
})
 
// journal siden
app.get('/nhm/journaler', (req, res) => {
    res.render('journaler', {
     })
 })

 app.get('*/loans', (req, res) => {
        res.render('loans', {})
 })

 // vallidation of input
 const validateUser = [
    body('lenderInfo.Institution').trim().escape(),
    body('lenderInfo.country').trim().escape(),
    body('lenderInfo.responsible-person').trim().escape(),
    body('lenderInfo.contact-person').trim().escape(),
    body('lenderInfo.other-person').trim().escape(),
    body('lenderInfo.post-address').trim().escape(),
    body('lenderInfo.street-address').trim().escape(),
    body('lenderInfo.phone').trim().escape(),
    body('lenderInfo.purpose').trim().escape(),
    body('lenderInfo.Special-documents').trim().escape(),
    body('lenderInfo.email').trim().normalizeEmail().isEmail(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors);
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];


 app.post('*/post-loan', validateUser,
 (req, res, next) => {
    // console.log('**************************************************************************');
    // console.log(req.body);
    loan.requestLoan(req.body)
     res.send('Success')
 },
);

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

app.get('*/artsObs', (req, res) => {
    if (req.query.kommune){ 
        artsObsReadFile.readMUSITgeoFile('kommuner.json', (error, results) => {
            if(results){
                res.send({
                    unparsed: results
                }) 
            } else {
                console.log('Error: could not read kommunedata file: ' + error)
            }
        })
    } else {
    res.render('artsObs', {})
    }
})



app.get('*/getRedlist', (req, res) => {
    adbAPI2.getRedlist(req.query.nameFile, (error, results) => {
        res.send({
            unparsed:results
        })
    })
})

app.get('*/DNAbarcodes', (req, res) => {
    if (!req.query.getFasta) {
        return res.render('DNAbarcodes', {})
        // callback(undefined, {error: 'no getfasta in query'})
    } else {
        barcoding.getFasta(req.query, (error, results) => {
            res.send({
                unparsed:results
            })
        })
    }
})

app.get('*/DNAbarcodesBirds', (req, res) => {
    if (!req.query.getFasta) {
        return res.render('DNAbarcodesBirds', {})
    } 
})

// barcoding: page with details for one species
app.get('*/bcSpecies', (req, res) => {
    if (!req.query.id) {
        return res.send({
            error: 'error in barcoding fungi overview'
        }) 
    } else {
        res.render('bcSpecies', {
            mySpecies: req.query.id
        })
    }
})

app.get('*/getFungiOverview', (req, res) => {
    try { 
        console.log(req.query)
        if (!fs.existsSync(`./src/utils/barcoding/sopp_oversikt.txt`)) {
            console.log('fungi-overview-file does not exist')
        } else {
            barcoding.getOverview( req.query, (error, results) => {
                res.send({
                    unparsed:results
                })
            })
            
            
        }
    } catch(error) {
        console.log('error in barcoding-overview on backend ' + error)
        throw new Error ('error in getoverview')
    }
})

app.get('*/getNamelist', (req, res) => {
    adbAPI2.getNamelist(req.query.nameFile, (error, results) => {
        res.send({
            unparsed:results
        })
    })
})

app.get('*/getCandidates', (req, res) => {
    adbAPI2.getCandidates(req.query.candidateFile, (error, results) => {
        res.send({
            unparsed:results
        })
    })
})

app.get('*/getNorwegianName', (req, res) => {
    if (req.query.latinName){ 
        adbAPI2.getNorwegianName(req.query.latinName, (error, results) => {
            if(results){
                console.log(results + ' linje 438 app.js')
                res.send({
                    unparsed: results
                }) 
            } else {
                console.log('Error: could not get Norwegian name: ' + error)
            }
        })
    } else {
        res.render('getNorwegianName', {})
    }
})

//proxy for downloading images from artsdatabanken
// https://dev.to/eckhardtd/downloading-images-in-the-browser-with-node-js-4f0h
app.get('*/tools/artsObsImage', cors(), async (req, res) => {
    if(req.query.url.endsWith('.jpg')){
        const response = await fetch(req.query.url);

        // Set the appropriate headers, to let
        // the browser know that it should save
        res.writeHead(200, {
            "content-disposition": 'attachment; filename="my-image.png"',
            "content-type": "image/jpg",
        });

        // Pipe the request buffer into
        // the response back to the client
        return response.body.pipe(res);
    } else {
        console.log('ender ikke med jpg');
    }    
})


// tool-page for checking if coordinates are within correct region
app.get('*/checkCoord', (req, res) => {
    if (!req.query.museum) {
        return res.render('checkCoord', {
        })
    } else if (req.query.download) {
        const filePath = 'src/data/' + req.query.museum + '/geoError/' + req.query.download
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

