import express from "express";

import { catchPokemon, getMyPokemons, getPokemons, releasePokemon, renamePokemon, savePokemon } from '../controllers/pokemons.js';

const router = express.Router();

router.get('/', getPokemons);
router.post('/catch', catchPokemon);
router.post('/save', savePokemon);
router.post('/rename', renamePokemon);
router.get('/my-pokemons', getMyPokemons);
router.post('/release', releasePokemon);

export default router;
