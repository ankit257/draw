import { renderToString } from 'react-dom/server';
import React from 'react';

export default (renderMe, preloadedState) => `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>App</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
        <link rel="stylesheet" href="https://v4-alpha.getbootstrap.com/examples/cover/cover.css" crossorigin="anonymous">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"/>
    </head>
    <body>
        <div class="site-wrapper" id="app">${renderToString(renderMe)}</div>
        ${preloadedState ? `
            <script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)};</script>
            <script src="/static/bundle.js"></script>
        ` : ''}
    </body>
</html>`;
