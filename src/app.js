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
const LoanInfo =  require('./utils/loans/loanInfo/loanInfoServer') 
const labels = require('./utils/labels/skilleark')
const archive = require('./utils/archive/archive_bck')
const hbs = require('hbs')
const helmet = require('helmet')
const { response } = require('express')
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs')
const readline = require('readline')
const csvParser = require('csv-parser')
const bodyParser = require('body-parser');

const app = express()
const multer  = require('multer')
const { error, log } = require('console')
// const upload = multer()

// Sikkerhets app som beskytter mot uønskede headers osv.
app.use(
    helmet({
        contentSecurityPolicy: false,
        xPermittedCrossDomainPolicies: false,
  })
)
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


app.get('/search', (req, res) => {
    if (!req.query.samling) {
        res.status(400).send({ error: 'Collection not chosen' });
    } else {
        try {
            fileRead.search(req.query.museum, req.query.samling, req.query.search, req.query.linjeNumber, req.query.limit, (error, results) => {
                if (error) {
                    res.status(500).send({ error: 'Error in fileRead search: ' + error.message });
                } else {
                    res.send(results);  // Directly sending the results array
                }
            });
        } catch (error) {
            console.error('Unexpected error: ' + error);
            res.status(500).send({ error: 'File not found' });
        }
    }
});


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


app.get('/getLineByNumber', (req, res, next) => {

    if (!req.query.linjeNumber || !req.query.museum || !req.query.samling) {
        return next(new Error('Missing required query parameters'));
    }

    try {
        fileRead.getLineByNumber(req.query.museum, req.query.samling, req.query.linjeNumber, (error, results) => {
            if (error) {
                console.error('Error in fileRead.js:', error);
                return next(new Error('File read error'));
            }
            
            res.send({
                unparsed: results
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return next(new Error('Unexpected server error'));
    }
});




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
    } else if (!req.query.orgGroup) {
        let coll = fileRead.getAllcollections(req.query.museum, req.query.orgGroup, (error, results) => {
        })
        res.send(coll)
    }  else {
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
 


app.get('*/bulkProjects', (req, res) => {
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
    
}) 

app.get('*/tools/loans', (req, res) => {
    res.render('howtoLoan', {
    })
})

app.get('*/loans', (req, res) => {
    res.render('loans', {})
})

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, './utils/loans/fileUploads'));
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage }).array('inFiles')


app.post('*/post-loan', async (req, res) => {
    upload(req, res, async function (err) {
        
        if (err) {
            console.log(err)
            res.status(400).send({
                message: err
             });
        } else {
            try {
            const result = await loan.requestLoan(req.body, req.files)
            if (result) {
                res.send('Success')  
            } else {
                res.status(500).send({
                    message: error
                 });
            }
            
            } catch (error) {
               console.log(error); 
               res.status(500).send({
                message: error
             });
            } 
        }
    })
 },
);


app.get('*/loanInfo', (req, res) => {
    if (!req.query.search) {
        res.render('loanInfo', {})
    } else {
        LoanInfo.LoanInfoSearch(req.query.search, limit = 1000, (error, results) => {
            if (results){
                res.send({
                    unparsed: results
                }) 
            } else {
                console.log('Error: could not read loanInfo file ' + error)
            }
        })
    }

})

// mulighet 1: send hele arrayen fra lånefila tilbake og søk etter ord i den. problem: får ikke til kode frontend; value; funksjon
// mulighet 2: gjør arrayen fra lånefila om til flat tekstfil. problem: det som leses fra fila er ikke tekst, det oppfattes som JSON, og lar seg ikke konvertere til tekst. 
app.get('*/getLoanInfoJSON', (req, res) => {
    if (!req.query.museum) {
        throw new Error ('no museum')
    } else {
        try {
            
            result = LoanInfo.LoanInfoSearch2(req.query.museum, req.query.search)
            // loanStringLines = loanString.replace(/loanId/g,"\nloanId")
            
            res.send(result)
        }
        catch(error) {
            console.log(error)
            throw new Error ('feil i app.js')
        }
    }
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
    barcoding.getCandidates(req.query.candidateFile, (error, results) => {
        res.send({
            unparsed:results
        })
    })
})

app.get('*/getNorwegianName', (req, res) => {
    if (req.query.latinName){ 
        adbAPI2.getNorwegianName(req.query.latinName, (error, results) => {
            if(results){
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

app.get('*/labels', async (req, res) => {
    try {
        const { museum, collection, labelType } = req.query;
        if (museum && collection && labelType) {
            const results = await labels.getValidNames(museum, collection, labelType);
            if (results) {
              res.send({ results });
            } else {
              throw new Error("No data available"); // create a new Error object with an error message
            }
        } else {
            res.render('labels');
        }
    } catch (error) {
        console.log('Error occurred (from labels): ' + error);
        res.status(500).send({
            unparsed: error.toString()
        });
    }
});


function validateRequest(req, res, next) {
    const { museum, collection, search, labelType } = req.body;

    if (!museum || !collection || !search || !labelType) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    next(); // Continue processing if validation passes
}

app.post('*/labels', validateRequest, async (req, res) => {
    try {
        const { museum, collection, search, labelType, extraInfo } = req.body;
        const results = await labels.selectLabel(search, museum, collection, labelType, extraInfo);
        res.json({ success: true, downloadLink: results.outFilepath, fileName: results.FileName });
    } catch (error) {
        console.error('Error occurred (labels post):', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Serve downloadable file with logging
app.get('*/download', (req, res) => {
    const {origin , fileName} = req.query;
   if (origin === 'labels')
   {
        const filePath = path.join( './public/forDownloads/labels', fileName); 

        res.download(filePath, (error) => {
            if (error) {
                console.log('Error sending file:', error);
                res.status(500).json({ error: 'Error sending file' });
            }
        });
    }
});

// journal siden
app.get('/nhm/journaler', (req, res) => {
    res.render('journaler', {
     })
 })

// Arkivsiden
app.get('*/archive', async (req, res) => {
    const { pageID, subFolder, documentType } = req.query;
    if (pageID) {
      res.render('item-page', { pageID });
    } else if (subFolder) {
      const subFolderPath = await archive.findSubfolder(documentType, subFolder);
      res.send(subFolderPath || 'not found');
    } else {
      res.render('archive');
    }
  });



// item-page, find mediafiles
app.post('*/item-page/check-files', async (req, res) => {
    try {
      const { folderName, fileName, directImagePath } = req.body;
      const result = await archive.checkFilesStartsWith(folderName, fileName, directImagePath);
      res.status(200).json({
        filePath: result.mediaObject.filePath,
        matchingFiles: result.mediaObject.matchingFiles, 
        folderPath: result.mediaObject.folderPath, 
        matchingScans: result.mediaObject.matchingScans
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });



// show images or files
app.get('*/archive/:folder/:filename', (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(__dirname, '..', '..', 'archive', folder, filename);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(`Error reading file: ${err}`);
        res.status(404).end();
      } else {
        const fileExtension = path.extname(filename);
        let contentType = '';
  
        switch (fileExtension) {
          case '.jpg':
          case '.jpeg':
            contentType = 'image/jpeg';
            break;
          case '.png':
            contentType = 'image/png';
            break;
          case '.pdf':
            contentType = 'application/pdf';
            break;
          case '.tif':
          case '.tiff':
            contentType = 'image/tiff';
            break;
          default:
            console.log(`Invalid file format: ${fileExtension}`);
            res.status(400).end();
            return;
        }
  
        res.contentType(contentType);
        res.send(data);
      }
    });
  });



app.get('*', (req, res) => {
    console.log('from 404: ');
    console.log(req.params);
    res.status(400).render('404', {})
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

