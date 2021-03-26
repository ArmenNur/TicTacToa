const http = require('http');
const app = require('./express')

const PORT = process.env.PORT || 3000;

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Server start on port: ${PORT}`)
})
