
const express = require("express")
const people = require('./routes/people')
const auth = require('./routes/auth')
const app = express();

app.use(express.static('./methods-public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use('/api/people', people)
app.use('/login', auth)



app.listen(5000, () => {
    console.log('server is listening on port 5000');
})


// const morgan = require('morgan')
// const { products, people } = require('./data')


// app.use(morgan('tiny'))

// app.get("/", (req, res) => {
//     res.send("<h1>HomePage</h1>");
// })

// app.get("/api/products/:id", (req, res) => {

//     const { id } = req.params
//     console.log(typeof id);
//     const specificProduct = products.find((item) => item.id === parseInt(id))
//     res.json(specificProduct)

// })
