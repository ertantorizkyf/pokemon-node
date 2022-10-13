import express from "express";
import bodyParser from "body-parser";
import expressEjsLayouts from "express-ejs-layouts";

import pokemonRoutes from "./routes/pokemons.js";

const app = express();
const PORT = 5000;

app.set('view engine', 'ejs');
app.use(expressEjsLayouts);

app.use(bodyParser.json());
app.use('/pokemons', pokemonRoutes);

app.get('/', (req, res) => {
    res.render('pokemon', { 
        layout: 'layouts/layout',
        extractScripts: true
    });
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
