const express = require('express');
const app = express();
const cors = require('cors');
const { checkMarkets } = require('./models/markets');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5000;

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in request bodies
app.use(express.json());

// Include the API router
const apiRouter = require('./router/apis');
const { TIMER } = require('./constants/values');
const { setProgram } = require('./controller/program');
const { checkEvents } = require('./models/events');
app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);

    // Set Program
    setProgram();
    
    require('./controller/fetchEventCategories')();

    // Monitoring Markets
    setTimeout(() => {
        checkMarkets();
        setInterval(() => {checkMarkets()}, TIMER.MARKET);
    }, TIMER.BASIC_DELAY);

    // Monitoring Events
    setTimeout(() => {
        checkEvents();
        setInterval(() => {checkEvents()}, TIMER.EVENT);
    }, TIMER.BASIC_DELAY * 2);
});