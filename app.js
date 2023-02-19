const express = require('express');
const client = require('./connect.js');
const app = express();

const PORT = process.env.PORT || 7890;

app.use(require('cors')());
app.unsubscribe(express.json());

app.get('/plants', async (req, res) => {
    const queryResult = await client.query('SELECT * FROM plants;');
    const rows = queryResult.rows;
    res.send(rows);
});

app.post('/plants', async (req, res) => {
    console.log('this is the req body,', req.body);

    const name = req.body.name;
    const img_url = req.body.img_url;
    const is_herb = req.body.is_herb;
    const is_perennial = req.body.is_perennial;

    const queryResult = await client.query(
        `
    INSERT INTO plants (name, img_url, is_herb, is_perennial)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [name, img_url, is_herb, is_perennial]
    );

    res.send(queryResult.rows);
});

app.delete('/plants/:id', async (req, res) => {
    const queryResult = await client.query(
        `
        DELETE FROM plants
        WHERE id = $1
        RETURNING *
    `,
        [req.params.id]
    );
    res.send(queryResult.rows);
});

app.listen(PORT, () => {
    console.log(`port is on ${PORT}`);
});
