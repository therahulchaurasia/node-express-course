const express = require("express")
const app = express();
const port = 3000
const tasks = require('./routes/tasks')

app.use(express.json())

app.get('/hello', (req, res) => {
    res.status(200).send('Task Manager App');
})

app.use('/api/v1/tasks', tasks)

app.listen(port, () => {
    console.log(`Server is listening on ${port}...`);
})