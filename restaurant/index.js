var express = require('express');
var app = express();

var things = require('./routes.js'); 
//both index.js and things.js should be in same directory
app.use('/items', things); 
app.set('view engine', 'pug');
app.set('views', './views');

app.listen(3001);

