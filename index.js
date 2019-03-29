const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 443 })

let DB = {}

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    switch (message) {
      case 'CLEAR': {
        DB = {}
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send('CLEAR')
          }
        })
        break
      }
      case 'REVEAL': {
        const arr = Object.values(DB)
        const average = arr.reduce((acc, curr) => acc + curr, 0) / arr.length

        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(average)
          }
        })
        break
      }
      default: {
        const { id, num } = JSON.parse(message)
        DB[id] = num
        break
      }
    }
  })
})
