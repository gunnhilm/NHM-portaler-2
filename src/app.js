const path = require('path')
const express = require('express')
const fileRead = require('./utils/fileread')
const footerDate = require('./utils/footerDate')
const hbs = require('hbs')
const papa = require('papaparse/papaparse')
//const language = require('./utils/languageFile')

const app = express()
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

/* const textItems = {
    placeholder: ["Søk", "Search"],
} */

app.get('', (req, res) => {
    if (!req.query.search) {
        return res.render('index', {
//            placeholder: textItems.placeholder[1]
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
app.get('/search', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'du må søke'
        })
    } else {

        fileRead.search(req.query.samling, req.query.search, (error, results) => {
            const parsedResults = papa.parse(results, {
                delimiter: "\t",
                newline: "\n",
                quoteChar: '',
                header: true,
            })
            JSON.stringify(parsedResults.data)
            res.send({
                results: parsedResults.data //,
                // unparsed: results
            })
        })
    }
})

// for å laste ned søkeresultatene
app.get('/download', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'ingen data å laste ned'
        })
    } else {

        fileRead.search(req.query.samling, req.query.search, (error, results) => {
            if (results){
                res.send({
                    unparsed: results
                })
            } else {
                console.log('Error: no results came back from seach')
            }
        })
    }
})



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
            error: 'du må oppgi et objekt'
        }) 
    } else {
            res.render('objekt', {
                myObject: req.query.id
                //language: document.querySelector('#language').value
             })
    }
})


app.get('/about', (req, res) => {
   res.render('about', {
    })
})

app.get('/help', (req, res) => {
    res.render('help', {})
})

app.get('*', (req, res) => {
    res.render('404', {})
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})