import React from 'react';
import TeamTable from './TeamTable';
import Pokedex from './Pokedex';

class PokemonTeamBuilder extends React.Component {
    render() {
        return (
            <div>
                <TeamTable/>
                <Pokedex/>
            </div>
        );
    }
}

export default PokemonTeamBuilder;