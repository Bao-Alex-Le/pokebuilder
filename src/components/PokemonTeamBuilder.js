import React, { forwardRef } from 'react';
import { act } from 'react-dom/test-utils';
import Party from './Party';
import Pokedex from './Pokedex';
import './styles/PokemonTeamBuilder.css';

class PokemonTeamBuilder extends React.Component {
    constructor(props) {
        super(props);

        const view = window.innerWidth <= 800 ? 'mobile' : 'desktop';

        this.state = {
            party: {
                '1': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: ''
                },
                '2': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: ''
                },
                '3': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: ''
                },
                '4': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: ''
                },
                '5': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: ''
                },
                '6': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: ''
                }
                
            },
            display: {
                view: view,
                mode: 'party',
                pokemon: null,
                slot: 0,
                moveSlot: 0
            }
        }

        /* Pokemon party selection*/
        this.handlePokemonSelect = this.handlePokemonSelect.bind(this);
        this.handlePartyPkmnSelect = this.handlePartyPkmnSelect.bind(this);
        this.handleReturnClick = this.handleReturnClick.bind(this);
        this.handleRemovePartyPkmn = this.handleRemovePartyPkmn.bind(this);

        /* Move/Item selection */
        this.handleShowMoves = this.handleShowMoves.bind(this);
        this.handleMoveSelect = this.handleMoveSelect.bind(this);
        this.handleShowItems = this.handleShowItems.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);

        /* Event handlers for focus, resizing, etc. */
        this.handleFocusIn = this.handleFocusIn.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('focusin', this.handleFocusIn);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('focusin', this.handleFocusIn);
    }

    handleResize() {
        const newDisplay = this.state.display;
        if (window.innerWidth <= 800 && this.state.display.view == 'desktop') {
            newDisplay.view = 'mobile';
            this.setState({ newDisplay });
        }
        else if (window.innerWidth > 800 && this.state.display.view == 'mobile') {
            newDisplay.view = 'desktop';
            this.setState({ newDisplay });
        }
    }

    handleFocusIn() {
        // handles focus for selecting pokemon moves/items
        const activeClass = document.activeElement.className.split(' ');
        if (activeClass.find(element => element == 'move-slot')) {
            const moveSlot = activeClass[activeClass.length-3];
            const slot     = activeClass[activeClass.length-2];
            const pokemon  = activeClass[activeClass.length-1];

            const newDisplay = this.state.display;
            newDisplay.mode     = 'moves';
            newDisplay.moveSlot = moveSlot;
            newDisplay.slot     = slot;
            newDisplay.pokemon  = pokemon.replaceAll('%20', ' ');

            this.setState({ display: newDisplay });
        } 
        else if (activeClass.find(element => element == 'item-select')) {
            const slot    = activeClass[activeClass.length-2];
            const pokemon = activeClass[activeClass.length-1];

            const newDisplay = this.state.display;
            newDisplay.mode     = 'items';
            newDisplay.moveSlot = 0;
            newDisplay.slot     = slot;
            newDisplay.pokemon  = pokemon.replaceAll('%20', ' ');

            this.setState({ display: newDisplay });
        }
    }

    handlePokemonSelect(pokemon) {
        const currentParty = Object.values(this.state.party);

        if (this.state.display.slot) { 
            // if a party member is currently selected, replaces party member with new pokemon
            const slot = this.state.display.slot;

            // adds pokemon to selected slot
            let newParty = this.state.party;
            newParty[slot] = {
                name: pokemon,
                moves: {'1': '', '2': '', '3': '', '4': ''},
                item: ''
            };

            // updates display to return to full party screen
            let newDisplay = this.state.display;
            newDisplay.mode = 'party';
            newDisplay.pokemon = pokemon;
            newDisplay.slot = 0;

            this.setState({
                party: newParty,
                display: newDisplay
            });
        } else {
            // else if full party is displayed adds new pokemon to party
            const firstEmptyPartySlot = currentParty.findIndex(slot => slot.name == '') + 1;

            // looks for first empty part slot and places new pokemon in that slot
            // else removes the oldest party member and shifts party with new pokemon in last slot
            if (!firstEmptyPartySlot) {
                this.setState(
                    { party: {
                        '1': currentParty[1],
                        '2': currentParty[2],
                        '3': currentParty[3],
                        '4': currentParty[4],
                        '5': currentParty[5],
                        '6': {
                            name: pokemon,
                            moves: {'1': '', '2': '', '3': '', '4': ''},
                            item: ''
                        }
                    }
                });
            } else {
                const newParty = this.state.party;
                newParty[firstEmptyPartySlot] = {
                    name: pokemon,
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: ''
                };
                this.setState({ party: newParty });
            }
        }
    }

    handleReturnClick() {
        // Returns to party from move/item select
        let newDisplay = this.state.display;
        newDisplay.mode = 'party';
        newDisplay.slot = 0;
        this.setState ({ display: newDisplay });
    }

    handlePartyPkmnSelect(slot) {
        let newDisplay = this.state.display;
        newDisplay.slot = slot;

        if (this.state.display.view == 'desktop') {

        } else {
            newDisplay.mode = 'pokedex';
        }

        this.setState({ display: newDisplay });
    }

    handleRemovePartyPkmn(slot) {
        // Removes selected pokemon from party and inserts empty pokemon slot
        let currentParty = Object.values(this.state.party);
        currentParty.splice(slot-1, 1);
        currentParty.push({
            name: '',
            moves: {'1': '', '2': '', '3': '', '4': ''},
            item: ''
        });

        // shifts empty pokemon slot to end of party
        const newParty = this.state.party;
        currentParty.forEach((partyMember, i) => {
            newParty[i+1] = partyMember;
        });

        // resets display to default party display
        let newDisplay = this.state.display;
        newDisplay.mode = 'party';
        newDisplay.slot = 0;
        this.setState({ 
            party: newParty,
            display: newDisplay
        });
    }

    handleShowMoves(pokemon, slot, moveSlot) {
        const newDisplay = this.state.display;
        newDisplay.mode     = 'moves';
        newDisplay.pokemon  = pokemon;
        newDisplay.slot     = slot;
        newDisplay.moveSlot = moveSlot;
        this.setState({
            display: newDisplay
        });
    }

    handleMoveSelect(moveName) {
        const newParty = this.state.party;
        const slot = this.state.display.slot;
        const moveSlot = this.state.lastFocus ? this.state.lastFocus : this.state.display.moveSlot;
        newParty[slot].moves[moveSlot] = moveName;
        this.setState({ newParty });
    }

    handleShowItems(pokemon, slot) {
        const newDisplay = this.state.display;
        newDisplay.mode     = 'items';
        newDisplay.pokemon  = pokemon;
        newDisplay.slot     = slot;
        this.setState({
            display: newDisplay
        });
    }

    handleItemSelect(itemName) {
        const newParty = this.state.party;
        const slot = this.state.display.slot;
        newParty[slot].item = itemName;
        this.setState({ newParty });
    }

    render() {
        let teamBuilderDisplay = [];
        const party = (
            <Party party={this.state.party} 
                    display={this.state.display}
                    onPartyPkmnClick = {this.handlePartyPkmnSelect}
                    onReturnClick    = {this.handleReturnClick}
                    onRemoveClick    = {this.handleRemovePartyPkmn}
                    onMoveClick      = {this.handleShowMoves}
                    onMoveSelect     = {this.handleMoveSelect}
                    onItemClick      = {this.handleShowItems}
                    onItemSelect     = {this.handleItemSelect}
                    key='0'
                />
        );
        const pokedex = ( <Pokedex onPokemonClick={this.handlePokemonSelect} party={this.state.party} key='1'/> );

        if (this.state.display.view == 'desktop') {
            teamBuilderDisplay.push(party);
            teamBuilderDisplay.push(pokedex);
        } else {
            if (this.state.display.mode == 'party') {
                teamBuilderDisplay.push(party);
            } else if (this.state.display.mode == 'pokedex') {
                teamBuilderDisplay.push(pokedex);
            }
        }
    
        return (
            <div className="team-builder">
                { teamBuilderDisplay }
            </div>
        );
    }
}

export default PokemonTeamBuilder;

/*
<Party party={this.state.party} 
                    display={this.state.display}
                    onPartyPkmnClick = {this.handlePartyPkmnSelect}
                    onReturnClick    = {this.handleReturnClick}
                    onRemoveClick    = {this.handleRemovePartyPkmn}
                    onMoveClick      = {this.handleShowMoves}
                    onMoveSelect     = {this.handleMoveSelect}
                    onItemClick      = {this.handleShowItems}
                    onItemSelect     = {this.handleItemSelect}
                />
                {this.state.display.view == 'desktop'
                    ? <Pokedex onPokemonClick={this.handlePokemonSelect} party={this.state.party}/>
                    : null
                }*/