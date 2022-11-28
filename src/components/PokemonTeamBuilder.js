import React, { useState, useEffect, forwardRef } from 'react';
import $ from 'jquery';
import Party from './Party';
import Pokedex from './Pokedex';
import Analysis from './Analysis';
import pokedexData from './utils/pokedex.json';
import { formatTeam, validateTeam } from './utils/teamUtils';
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
                    item: '',
                    ability: ''
                },
                '2': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: '',
                    ability: ''
                },
                '3': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: '',
                    ability: ''
                },
                '4': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: '',
                    ability: ''
                },
                '5': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: '',
                    ability: ''
                },
                '6': {
                    name: '',
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: '',
                    ability: ''
                }
                
            },
            display: {
                view: view,
                mode: 'party',
                pokemon: null,
                slot: 0,
                moveSlot: 0,
                windowHeight: window.innerHeight
            },
            dexMode: true,
            import: false,
            importText: ''
        }

        // Pokemon party selectio
        this.handlePokemonSelect = this.handlePokemonSelect.bind(this);
        this.handlePartyPkmnSelect = this.handlePartyPkmnSelect.bind(this);
        this.handleReturnClick = this.handleReturnClick.bind(this);
        this.handleRemovePartyPkmn = this.handleRemovePartyPkmn.bind(this);

        // Move/Item selection
        this.handleShowMoves = this.handleShowMoves.bind(this);
        this.handleMoveSelect = this.handleMoveSelect.bind(this);
        this.handleShowItems = this.handleShowItems.bind(this);
        this.handleItemSelect = this.handleItemSelect.bind(this);
        this.handleAbilitySelect = this.handleAbilitySelect.bind(this);

        // Pokedex/Analysis mode selection
        this.handlePokedexClick = this.handlePokedexClick.bind(this);
        this.handleAnalysisClick = this.handleAnalysisClick.bind(this);
        this.handleImportClick = this.handleImportClick.bind(this);

        // Event handlers for focus, resizing, etc.
        this.handleFocusIn = this.handleFocusIn.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        document.addEventListener('focusin', this.handleFocusIn);
        const view = window.innerWidth <= 800 ? 'mobile' : 'desktop';
        const newDisplay = this.state.display;
        newDisplay.view = view;
        newDisplay.windowHeight = window.innerHeight;
        this.setState({ newDisplay });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('focusin', this.handleFocusIn);
    }

    handleResize() {
        const newDisplay = this.state.display;
        if (window.innerWidth <= 800 && this.state.display.view == 'desktop') {
            newDisplay.view = 'mobile';
        }
        else if (window.innerWidth > 800 && this.state.display.view == 'mobile') {
            newDisplay.view = 'desktop';
            newDisplay.mode = 'party';
        }
        newDisplay.windowHeight = window.innerHeight;
        this.setState({ newDisplay });
    }

    handleFocusIn() {
        // handles which element will be in focus when clicked
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

    handlePokedexClick() {
        if (!this.state.dexMode) this.setState({dexMode: true});
    }

    handleAnalysisClick() {
        if (this.state.dexMode) this.setState({dexMode: false});
    }

    handleImportClick(newParty) {
        if (this.state.import && newParty) {
            this.setState({
                party: newParty,
                import: false
            });
        }
        else if (!this.state.import) {
            this.setState({import: true});
        }
    }

    handlePokemonSelect(pokemon) {
        const currentParty = Object.values(this.state.party);
        const ability = pokedexData[pokemon].abilities[0];

        if (this.state.display.slot) { 
            // if a party member is currently selected, replaces party member with new pokemon
            const slot = this.state.display.slot;

            // adds pokemon to selected slot
            let newParty = this.state.party;
            newParty[slot] = {
                name: pokemon,
                moves: {'1': '', '2': '', '3': '', '4': ''},
                item: '',
                ability: ability
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
                            item: '',
                            ability: ability
                        }
                    }
                });
            } else {
                const newParty = this.state.party;
                newParty[firstEmptyPartySlot] = {
                    name: pokemon,
                    moves: {'1': '', '2': '', '3': '', '4': ''},
                    item: '',
                    ability: ability
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

    handleAbilitySelect(ability, slot) {
        const newParty = this.state.party;
        newParty[slot].ability = ability;
        this.setState({ newParty })
    }

    render() {
        let teamBuilderDisplay = [];
        let partyVisibility, pokedexVisibility;
        if (this.state.display.view == 'desktop') {
            partyVisibility = 'visible-flex';
            pokedexVisibility = 'visible-block';
        } else {
            if (this.state.display.mode == 'party' || this.state.display.mode == 'moves' || this.state.display.mode == 'items') {
                partyVisibility = 'visible-flex';
                pokedexVisibility = 'hidden';
            } else if (this.state.display.mode == 'pokedex') {
                partyVisibility = 'hidden';
                pokedexVisibility = 'visible-block';
            } 
            if (!this.state.dexMode) {
                partyVisibility = 'hidden';
                pokedexVisibility = 'visible-block';
            }
        }

        const party = (
            <div className={`party wrapper ${partyVisibility}`} key='1'>
                <DexAnalysisMenu dexMode={this.state.dexMode} 
                    import={this.state.import} 
                    party={this.state.party}
                    onPokedexClick={this.handlePokedexClick} 
                    onAnalysisClick={this.handleAnalysisClick} 
                    onImportClick={this.handleImportClick} 
                    key='1'
                />
                <Party party={this.state.party}
                    display={this.state.display}
                    onPartyPkmnClick = {this.handlePartyPkmnSelect}
                    onReturnClick    = {this.handleReturnClick}
                    onRemoveClick    = {this.handleRemovePartyPkmn}
                    onMoveClick      = {this.handleShowMoves}
                    onMoveSelect     = {this.handleMoveSelect}
                    onItemClick      = {this.handleShowItems}
                    onItemSelect     = {this.handleItemSelect}
                    onAbilitySelect  = {this.handleAbilitySelect}
                    key='2'
                />
            </div>
        );

        let pokedexDisplay;
        if (this.state.dexMode) {
            pokedexDisplay = ( 
                <Pokedex 
                    onPokemonClick={this.handlePokemonSelect} 
                    party={this.state.party} 
                    display={this.state.display}
                    visibility={pokedexVisibility} 
                    key='2'/> 
            );
        } else {
            pokedexDisplay = ( 
                <div className='analysis'>
                    <Analysis party={this.state.party} 
                        onCloseClick={this.handlePokedexClick} key='3'
                    />
                </div>
            );
        }

        teamBuilderDisplay.push(party);
        teamBuilderDisplay.push(pokedexDisplay);
    
        return (
            <div className="team-builder">
                { teamBuilderDisplay }
            </div>
        );
    }
}

function DexAnalysisMenu(props) {
    const [importText, setImportText] = useState(formatTeam(props.party));

    function handlePokedexClick(e) {
        props.onPokedexClick();
    }

    function handleAnalysisClick(e) {
        props.onAnalysisClick();
    }

    function handleImportClick(e) {
        let newParty;
        if (props.import) { // import area is already open, validate team
            newParty = validateTeam(importText);
        } else {
            setImportText(formatTeam(props.party));
        }
        props.onImportClick(newParty);
    }

    function handleImportChange(value) {
        setImportText(value);
    }

    const dexClass = props.dexMode ? 'dex-button dex-menu-selected' : 'dex-button';
    const analysisClass = props.dexMode ? 'analysis-button' : 'analysis-button dex-menu-selected';
    const importClass = props.import ? 'import-export dex-menu-selected' : 'import-export';

    return (
        <div className='dex-analysis'>
            <div className='dex-analysis-menu'>
                <div className={dexClass} onClick={handlePokedexClick}><div>Pokedex</div></div>
                <div className={analysisClass} onClick={handleAnalysisClick}><div>Analysis</div></div>
                <div className={importClass} onClick={handleImportClick}>
                    <div className='import'></div>
                    <div className='export'></div>
                    <div className='import-label'>
                        <div>Import/</div>
                        <div>Export</div>
                    </div>
                </div>
            </div>
            {
                props.import &&
                <Importer 
                    party={props.party} 
                    onImportChange={handleImportChange} 
                    onSaveClick={handleImportClick}
                    importText={importText}
                />
            }
        </div>
    );
}

function Importer(props) {
    useEffect(() => {
        document.getElementById('import-area').select();
    }, []);

    function handleImportChange(e) {
        props.onImportChange(e.target.value);
    }

    return (
        <div className='importer'>
            <textarea 
                id='import-area'
                className='import-area' 
                autoFocus
                onChange={handleImportChange}
                value={props.importText}>
            </textarea>
            <div className='save-import' onClick={props.onSaveClick}>Save</div>
        </div>
    );
}

export default PokemonTeamBuilder;