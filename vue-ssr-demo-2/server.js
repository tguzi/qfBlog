const fs = require('fs');
const path = require('path');
const express = require('express');
const renderer = require('vue-server-renderer').createRenderer();
const app = express();
const clientBundleFileUrl = '/bundle.client.js'
app.use('', express.static(__dirname + '/dist'))
const createApp = require('./dist/bundle.server.js')['default'];
app.get('*', (req, res) => {
  const ctx = { url: req.url }
  const app = createApp(ctx)
  if (app.code && app.code == 404) {
    res.status(404).end('Page not found');
    return
  }
  renderer.renderToString(app, (err, html) => {
    if (err) {
      res.status(500).send(`
        <h1>Error: ${err.message}</h1>
        <pre>${err.stack}</pre>
      `)
    } else {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Vue SSR</title>
          </head>
          <body>
            <div id="app">${html}</div>
            <script src="${clientBundleFileUrl}"></script>
          </body>
        </html>
      `)
    }
  })
})
app.listen(8080)