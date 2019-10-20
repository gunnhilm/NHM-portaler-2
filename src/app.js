const path = require('path')
const express = require('express')
const fileRead = require('./utils/fileread3')
const hbs = require('hbs')
const papa = require('papaparse/papaparse')

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

app.get('', (req, res) => {
    if (!req.query.search) {
        return res.render('index')
    } else {
        fileRead.search(req.query.search, (error, results) => {
            // console.log( results);
            res.render('index', {
                results: results
             })
        
         })
    }
})



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
                results: parsedResults.data
            })
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