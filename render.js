import { renderToString } from 'react-dom/server';
import React from 'react';

export default (renderMe, preloadedState) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>App</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
    </head>
    <body>
        <div id="app">${renderToString(renderMe)}</div>
        ${preloadedState ? `
            <script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)};</script>
            <script src="/static/bundle.js"></script>
        ` : ''}
    </body>
</html>`;
