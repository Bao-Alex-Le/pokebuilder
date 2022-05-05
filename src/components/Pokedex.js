import React from 'react';
import Pokemon from './Pokemon';
import pokedex from './utils/pokedex.json';
import typeColours from './utils/typeColours';
import './styles/Pokedex.css';

/**
 * This components acts as a container for all the pokemon components
 * displays a list of every pokemon w/ sprites, types, names
 */

class Pokedex extends React.Component {
    render() {
        // maps list of Pokemon components with data from ./utils/pokedex.json
        const pokemonList = Object.entries(pokedex).map((pokemonData) => {
            const id          = pokemonData[1]['id'];
            const pokemon     = pokemonData[0];
            const dexNum      = pokemonData[1]['pokedex_num'];
            const icon        = pokemonData[1]['icon'];
            const type1       = pokemonData[1]['type1'];
            const type2       = pokemonData[1]['type2'];
            const type1Colour = typeColours[type1.toLowerCase()][0];
            const type2Colour = type2 ? typeColours[type2.toLowerCase()][0] : '';
            
            // renders pokemon component in pokedex list if not already selected in party
            const visible = Boolean(!Object.values(this.props.party).find(pkmn => pkmn == pokemon));

            return (
                <Pokemon key={id} 
                    pokemon={pokemon} 
                    dexNum={dexNum}
                    icon={icon}
                    type1={type1}
                    type2={type2}
                    type1Colour={type1Colour}
                    type2Colour={type2Colour}
                    onPokemonClick={this.props.onPokemonClick}
                    visible={visible}
                />
            )
        });

        return (
            <div className="pokedex">
                {pokemonList}
            </div>
        );
    }
}

export default Pokedex;