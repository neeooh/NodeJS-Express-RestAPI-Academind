const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Router routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect(
    "mongodb+srv://" + process.env.MONGO_ATLAS_USER + ":" + process.env.MONGO_ATLAS_PW + "@" + process.env.MONGO_ATLAS_ADDRESS + "?retryWrites=true&w=majority",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
// Uncomment the below if you get a deprecation warning
//mongoose.Promise = global.Promise; //use Node.js promise implementation instead of mongoose

// Middleware

//append headers to disable CORS (Postman will not throw CORS errors as it is just a test tool and it doesn't care, CORS is enforced by a browser)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //allow from all or instead of asterisk, it could be 'http://mycoolapp.com'
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-Width, Content-Type, Accept, Authorization'); //which kind of headers we accept

    // The browser will always send OPTIONS req first when you send a POST, GET etc request
    // Let the browser know what kind of requests we accept
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    //next is needed otherwise the above options will be always returned
    next();
});

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'Hello world!'
//     });
// });
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// if we get past this point, no routes were not found
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// this will handle the rest of errors, e.g. if the app crashes
app.use((error, req, res, next) => {
   res.status(error.status || 500);
   res.json({
        error: {
            message: error.message
        }

   });
});

module.exports = app;