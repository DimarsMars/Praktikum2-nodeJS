import express from 'express';
import mysql from 'mysql2';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

const swaggerDocument = YAML.parse(fs.readFileSync('./openapi-test.yml', 'utf8'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'openapi',
    password: ''
});

const app = express();
app.use(express.json());


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/user', (req, res) => {
    db.query(
        'SELECT * FROM user', (err, results) => {
            if (err) {
                res.status(500).send('Internal Server Error');
                return;
            }
            
            res.json(results);
        });
    });
    
app.post('/user', (req, res) => {
    db.query(
        'INSERT INTO user (name, email, age) VALUES (?, ?, ?)', [req.body.name,req.body.email,req.body.age], 
        (err, result) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        
        res.json(result);
    });
});


app.get('/users/:id', (req, res) => {
    db.query(
        'SELECT * FROM user WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        
        res.json(result);
    });
});

app.put('/users/:id', (req, res) => {
    db.query(
        'UPDATE user SET name = ?, email = ?, age = ? WHERE id = ?', [req.query.name,req.query.email,req.query.age,req.params.id], 
        (err, result) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        
        res.json(result);
    });
});

app.delete('/users/:id', (req, res) => {
    db.query(
        'DELETE FROM user WHERE id = ?', [req.params.id], 
        (err, result) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }
        
        res.json(result);
    });
});

app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));

