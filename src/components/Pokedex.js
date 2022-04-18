import React from 'react';
import Pokemon from './Pokemon';
const pokedex = require('./utils/pokedex.json');

/**
 * This components acts as a container for all the pokemon components
 * displays a list of every pokemon w/ sprites and names
 */

class Pokedex extends React.Component {
    render() {
        // maps list of Pokemon components with data from pokedex.json
        const pokemonList = Object.entries(pokedex).map((pokemonData) => {
            return (
            <Pokemon key={pokemonData[1]['id']} 
            pokemon={pokemonData[0]} 
            dexNum={pokemonData[1]['pokedex_num']}
            icon={pokemonData[1]['icon']}
            />
            )
        });

        return (
            <div>
                {pokemonList}
            </div>
        );
    }
}

export default Pokedex;