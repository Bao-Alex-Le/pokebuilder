import React from 'react';
import Party from './Party';
import Pokedex from './Pokedex';
import './styles/PokemonTeamBuilder.css';

class PokemonTeamBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            party: {
                1: '',
                2: '',
                3: '',
                4: '',
                5: '',
                6: ''
            },
            partyDisplay: {
                mode: 'party',
                pokemon: null
            }
        }

        this.handlePokemonSelect = this.handlePokemonSelect.bind(this);
        this.handleRemovePartyMember = this.handleRemovePartyMember.bind(this);
        this.handleShowMoves = this.handleShowMoves.bind(this);
        this.handleShowItems = this.handleShowItems.bind(this);
    }

    handlePokemonSelect(pokemon, slot) {
        const currentParty = Object.values(this.state.party);
        const firstEmptyPartySlot = currentParty.findIndex(slot => slot == '') + 1;

        // looks for first empty part slot and places new pokemon in that slot
        // else removes the oldest party member and shifts party with new pokemon in last slot
        if (!firstEmptyPartySlot) {
            this.setState(
                { party: {
                    1: currentParty[1],
                    2: currentParty[2],
                    3: currentParty[3],
                    4: currentParty[4],
                    5: currentParty[5],
                    6: pokemon
            }});
        } else {
            const newParty = this.state.party;
            newParty[firstEmptyPartySlot] = pokemon;
            this.setState({ party: newParty });
        }
    }

    handleRemovePartyMember(slot) {
        let currentParty = Object.values(this.state.party);
        currentParty.splice(slot-1, 1);
        currentParty.push('');

        const newParty = this.state.party;
        currentParty.forEach((partyMember, i) => {
            newParty[i+1] = partyMember;
        });

        this.setState({ party: newParty });
    }

    handleShowMoves(slot) {

    }

    handleShowItems(slot) {

    }

    render() {
        return (
            <div className="team-builder">
                <Party party={this.state.party} 
                    onPartyMemberClick={this.handleRemovePartyMember} 
                    display={this.state.partyDisplay}
                    onMoveClick={this.handleShowMoves}/>
                <Pokedex onPokemonClick={this.handlePokemonSelect} party={this.state.party}/>
            </div>
        );
    }
}

export default PokemonTeamBuilder;