import fetch from 'node-fetch';

import { db } from '../database.js';

export const getPokemons = async (req, res) => {
    res.render('pokemon', { 
        layout: 'layouts/layout',
        extractScripts: true
    });
}

export const getMyPokemons = async (req, res) => {
    // * GET ALL CAUGHT POKEMON
    const results = await db.promise().query(`SELECT * FROM my_pokemons`);
    res.status(200).send({
        'message': 'My Pokemons Fetched',
        'data': results
    });
}

export const catchPokemon = async (req, res) => {
    // * 50% PROBABILITY OF CATCHING POKEMON
    var number = Math.floor(Math.random() * (1 - 0 + 1) + 0);

    res.status(200).send({
        'message': number == 1 ? 'Pokemon caught' : 'Fail to catch pokemon',
        'data': number
    });
}

export const savePokemon = async (req, res) => {
    // * GET REQUEST BODY
    const { name, image, nickname } = req.body;

    // * GET ALL POKEMONS WITH SIMILAR NICKNAME
    const results = await db.promise().query(`SELECT * FROM my_pokemons WHERE nickname = '${nickname}' OR nickname LIKE '${nickname}-%' ORDER BY id ASC`);
    const myPokemons = results[0];
    var fibonacciNickname = '';
    var nicknames = [];
    for(var i = 0; i < myPokemons.length; i++) {
        var currentNickname = myPokemons[i].nickname;
        nicknames.push(currentNickname.split('-'));
    }

    // * FIND FIBONACCI SEQUENCE NUMBER AND APPEND TO NICKNAME BODY
    if(nicknames.length == 0) {
        fibonacciNickname = nickname;
    } else if(nicknames[nicknames.length-1].length == 1) {
        fibonacciNickname = nickname + '-0';
    } else {
        var lastSequence = nicknames[nicknames.length-1][1];
        var nextSequence = 0;

        if(parseInt(lastSequence) > 1) {
            nextSequence = parseInt(lastSequence) * (1 + Math.sqrt(5)) / 2.0;
        } else if(parseInt(lastSequence) == 1) {
            const oneSequence = await db.promise().query(`SELECT * FROM my_pokemons WHERE nickname LIKE '${nickname}-1'`);
            if(oneSequence[0].length == 1) {
                nextSequence = 1;
            } else {
                nextSequence = 2;
            }
        } else {
            nextSequence = 1;
        }
        nextSequence = Math.round(nextSequence);

        fibonacciNickname = nickname + '-' + nextSequence.toString();
    }

    // * INSERT TO MY POKEMON
    if(name && image && nickname) {
        try {
            db.promise().query(`INSERT INTO my_pokemons(name, image, nickname) 
                VALUES('${name}', '${image}', '${fibonacciNickname}')`);
            res.status(201).send({
                'message': 'Saved to my pokemon',
                'data': null
            });
        } catch(err) {
            console.log(err);
        }    
    }
}

export const renamePokemon = async (req, res) => {
    // * GET REQUEST BODY
    const { id, nickname } = req.body;

    // * GET ALL POKEMONS WITH SIMILAR NICKNAME
    const results = await db.promise().query(`SELECT * FROM my_pokemons WHERE nickname = '${nickname}' OR nickname LIKE '${nickname}-%' ORDER BY id ASC`);
    const myPokemons = results[0];
    var fibonacciNickname = '';
    var nicknames = [];
    for(var i = 0; i < myPokemons.length; i++) {
        var currentNickname = myPokemons[i].nickname;
        nicknames.push(currentNickname.split('-'));
    }

    // * FIND FIBONACCI SEQUENCE NUMBER AND APPEND TO NICKNAME BODY
    if(nicknames.length == 0) {
        fibonacciNickname = nickname;
    } else if(nicknames[nicknames.length-1].length == 1) {
        fibonacciNickname = nickname + '-0';
    } else {
        var lastSequence = nicknames[nicknames.length-1][1];
        var nextSequence = 0;

        if(parseInt(lastSequence) > 1) {
            nextSequence = parseInt(lastSequence) * (1 + Math.sqrt(5)) / 2.0;
        } else if(parseInt(lastSequence) == 1) {
            const oneSequence = await db.promise().query(`SELECT * FROM my_pokemons WHERE nickname LIKE '${nickname}-1'`);
            if(oneSequence[0].length == 1) {
                nextSequence = 1;
            } else {
                nextSequence = 2;
            }
        } else {
            nextSequence = 1;
        }
        nextSequence = Math.round(nextSequence);

        fibonacciNickname = nickname + '-' + nextSequence.toString();
    }

    // * UPDATE POKEMON NAME
    if(id && nickname) {
        try {
            db.promise().query(`UPDATE my_pokemons
                SET nickname = '${fibonacciNickname}'
                WHERE id = ${id}`);
            res.status(201).send({
                'message': 'Pokemon renamed',
                'data': null
            });
        } catch(err) {
            console.log(err);
        }    
    }
}

export const releasePokemon = async (req, res) => {
    // * GET MY POKEMON ID
    var myPokemonId = req.query.id;
    myPokemonId = parseInt(myPokemonId);

    // * GET PRIME NUMBER BETWEEN 0 AND 99
    var number = Math.floor(Math.random() * 100);

    // * CHECK IF NUMBER IS PRIME NUMBER
    var isPrime = true;
    if (number <= 1) isPrime = false;
    if (number == 2 || number == 3) isPrime = true;
    if ((number % 2 == 0 && number != 2) || (number % 3 == 0 && number != 3)) isPrime = false;
    for (var i = 5; i * i <= number; i = i + 6) {
        if (number % i == 0 || number % (i + 2) == 0) isPrime = false;
    }

    if(isPrime) {
        // * DELETE DATA FROM TABLE IF GENERATED NUMBER IS A PRIME NUMBER
        db.promise().query(`DELETE FROM my_pokemons WHERE id = ${myPokemonId}`);
        res.status(200).send({
            'message': 'Pokemon released',
            'data': 1
        });
    } else {
        res.status(200).send({
            'message': 'Fail to release pokemon',
            'data': 0
        });
    }
}
