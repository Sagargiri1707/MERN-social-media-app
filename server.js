const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const App = express()
const PORT = 5001

App.use(express.json())
App.use(morgan("dev"))
App.use(cookieParser())
App.use(cors({
    origin: '*',
    optionsSuccessStatus: 200,
  }))
  
mongoose.connect('mongodb://localhost/mernUdemy',
    { useUnifiedTopology: true , useNewUrlParser: true }
)

const connection = mongoose.connection
connection.once('error', () => {
    console.log('Error auth failed Databse failed to open');
})
connection.once('open', () => {
    console.log('Database connected successfully');
})
  
const post = require('./routes/post')
App.use('/post', post)
const auth=require('./routes/auth')
App.use('/auth', auth)
const user=require('./routes/user')
App.use('/user', user)
const routes=require('./routes/routes')
App.use('/routes',routes)

App.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({"err":'invalid token...'});
    }
});

App.listen(PORT, () => {
    console.log(`server started on ${PORT}`);
    
})