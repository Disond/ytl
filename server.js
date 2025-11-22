const express = require('express')
const app = express()
const port = 3000

let data = {
    name: "TestName"
}

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/dashboard', (req, res) => {
    res.send('<h1>dashboard</h1>')
})

// API ENDPOINTS

app.get('/api/data', (req, res) => {
    console.log('This is for DATA')
    res.send(data)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
