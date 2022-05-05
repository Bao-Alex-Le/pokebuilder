import React from 'react';
import PartyMember from './PartyMember';
import './styles/Party.css';
const pokedex = require('./utils/pokedex.json');

class Party extends React.Component {
    render() {
        const display = this.props.display['mode'];

        let party;
        let partyList;
        if (display == 'party'){
            party = Object.entries(this.props.party);
            partyList = party.map(slot => {
                const slotNum = slot[0];
                const pokemon = slot[1] ? slot[1] : null;
                const pokemonData = pokemon ? pokedex[pokemon] : null;

                return (
                    <PartyMember key={slotNum}
                    slot={slotNum}
                    pokemon={pokemon}
                    pokemonData={pokemonData}
                    onPartyMemberClick={this.props.onPartyMemberClick}
                    />
                )
            });
        }
        

        return (
            <div className="party">
                {partyList}
            </div>
        );
    }
}

export default Party;