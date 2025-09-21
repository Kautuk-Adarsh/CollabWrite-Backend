require('dotenv').config();
require('./db'); 
const app = require('./App'); 
const port = 5000;

app.listen(port, () => {
    console.log(`Everything is working correctly on port ${port}`);
});
