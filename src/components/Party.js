import React, { useEffect } from 'react';
import PartyPkmn from './PartyPkmn';
import './styles/Party.css';
import pokedex from './utils/pokedex.json';
import itemIcon from '../img/itemicons.png';
import moves from './utils/moves.json';
import items from './utils/items.json';
import learnsets from './utils/learnsets.json';

class Party extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: ''
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchReset = this.handleSearchReset.bind(this);
    }

    handleSearchChange(query) {
        this.setState({ search: query.toLowerCase() });
    }

    handleSearchReset() {
        this.setState({ search: '' })
    }

    render() {
        const display = this.props.display;
        let party;
        let partyDisplay;

        /** Displays party list of up to 6 selected pokemon, default view
         *  When pokemon in pokedex gets clicked party will be updated with selected pokemon
         */ 
        if (display['mode'] == 'party') {
            party = Object.entries(this.props.party);
            partyDisplay = party.map(slot => {
                const slotNum = slot[0];
                const pokemon = slot[1].name ? slot[1].name : null;
                const moves   = slot[1].moves;
                const item    = slot[1].item;
                const ability = slot[1].ability;
                const tera    = slot[1].tera;
                const pokemonData = pokemon ? pokedex[pokemon] : null;
                const name = pokemonData ? pokemonData['name'] : null;

                return (
                    <PartyPkmn key={slotNum}
                        slot={slotNum}
                        pokemon={pokemon}
                        name={name}
                        moves={moves}
                        item={item}
                        ability={ability}
                        tera={tera}
                        display={display['mode']}
                        pokemonData={pokemonData}
                        onPartyPkmnClick={this.props.onPartyPkmnClick}
                        onReturnClick={this.props.onReturnClick}
                        onRemoveClick={this.props.onRemoveClick}
                        onMoveClick={this.props.onMoveClick}
                        onItemClick={this.props.onItemClick}
                        onAbilitySelect={this.props.onAbilitySelect}
                        onTeraSelect={this.props.onTeraSelect}
                        onSearchReset={this.handleSearchReset}
                    />
                )
            });
        } 

        /** Alternate view for when user adds/moves item for a particular party member
         *  Displays selected party member at top with a generated list of moves or items below to be selected
        */
        else {
            const pokemon = display['pokemon'];
            const slot = display['slot'];

            // final display of pokemon followed by selection list
            partyDisplay = (
                <div className='select-party-pkmn'>
                    <PartyPkmn slot={slot}
                        pokemon={pokemon}
                        moves={this.props.party[slot].moves}
                        item={this.props.party[slot].item}
                        ability={this.props.party[slot].ability}
                        tera={this.props.party[slot].tera}
                        pokemonData={pokedex[pokemon]}
                        display={display['mode']}
                        moveSlot={display['moveSlot']}
                        onPartyPkmnClick={this.props.onPartyPkmnClick}
                        onReturnClick={this.props.onReturnClick}
                        onRemoveClick={this.props.onRemoveClick}
                        onMoveClick={this.props.onMoveClick}
                        onItemClick={this.props.onItemClick}
                        onAbilitySelect={this.props.onAbilitySelect}
                        onTeraSelect={this.props.onTeraSelect}
                        onSearchReset={this.handleSearchReset}
                    />
                    <Search handleSearch={this.handleSearchChange}/>
                    <List display={display['mode']} 
                        pokemon={pokemon}
                        search={this.state.search}
                        onMoveSelect={this.props.onMoveSelect}
                        onItemSelect={this.props.onItemSelect}
                    />
                </div>
            );
        }

        return (
            <div className="party display">
                {partyDisplay}
            </div>
        );
    }
}


/**
 *  List element that populates a list of moves or items depending on what was selected by user
 */
function List(props) {
    useEffect(() => {
        document.getElementById('list').scrollIntoView();
    });

    let displayList;
    let learnsetMoves = [];
    let allMoves = [];

    if (props.display == 'moves') {
        let key = 0;

        // Creates JSX list of elements displaying all moves that can be selected
        Object.keys(moves).forEach(move => {
            if (move.toLowerCase().search(props.search) >= 0) {
                const moveData = moves[move];
                const name     = moveData['name'];
                const fname    = moveData['fname'];
                const type     = moveData['type'];
                const category = moveData['category'];
                const power    = moveData['power'];
                const accuracy = moveData['accuracy'];
                const moveComponent = (
                    <Move key={key++}
                        name={name}
                        fname={fname}
                        type={type}
                        category={category}
                        power={power}
                        accuracy={accuracy}
                        onMoveSelect={props.onMoveSelect}
                    />
                )

                // moves that are within selected pokemon's learn set are seperated and displayed at top of list
                const learnsetList = pokedex[props.pokemon]['learnset'];
                const inLearnset = learnsetList.some(learnsetName => {
                    if(learnsets[learnsetName]) {
                        return learnsets[learnsetName]['learnset'][move];
                    }
                    return false;
                });
            
                if (inLearnset) {
                    learnsetMoves.push(moveComponent);
                } else {
                    allMoves.push(moveComponent);
                }
            }
        })

        // Creating labels for learnset moves and all moves, then combining the two lists
        if (learnsetMoves.length) learnsetMoves.unshift(<div className='move-label'>Learnset Moves</div>);
        if(allMoves.length) allMoves.unshift(<div className='move-label'>All Moves</div>);
        displayList = learnsetMoves.concat(allMoves);

    } else if (props.display == 'items') {

        // Creates JSX list of elements displaying all items that can be selected
        displayList = Object.entries(items).map((item, index) => {
            const name = item[0];
            const icon = item[1]['spriteNum'];
            const desc = item[1]['desc']
            if (name.toLowerCase().search(props.search) >= 0) {
                return (
                    <Item key={index} 
                    name={name}
                    icon={icon}
                    desc={desc}
                    onItemSelect={props.onItemSelect}
                    />
                );
            }
        });
    }

    return (
        <div id='list' className={`${props.display} list`}>
            {displayList}
        </div>
    )
}

// individual Move element as populated in List
function Move(props) {
    function handleMoveSelect(e) {
        props.onMoveSelect(props.fname); //selects move and adds to pokemon move slot
    }

    return (
        <div className='move' onClick={handleMoveSelect}>
            <div className='move-name'>{props.name}</div>
            <img className='move-type' src={require(`../img/types/${props.type}.png`)}/>
            <img className='move-category' src={require(`../img/types/${props.category}.png`)}/>
            <div className='move-power'>Pwr. {props.power}</div>
            <div className='move-accuracy'>Acc. {props.accuracy}</div>
        </div>
    );
}

// individual Item element as populated in List
function Item(props) {
    function handleItemSelect(e) {
        props.onItemSelect(props.name); //selects item and adds to pokemon item slot
    }

    // Calculating top-left coordinates for icon in spritesheet
    const iconNum = props.icon;
    const top = Math.floor(iconNum / 16) * 24;
    const left = (iconNum % 16) * 24;

    const imgStyle = {
        width: '24px',
        height: '24px',
        margin: '0 5px',
        boxSizing: 'content-box',
        background: 'url(' + itemIcon + ')',
        backgroundPosition: `-${left}px -${top}px`,
        flexShrink: '0'
    }

    return (
        <div className='item' onClick={handleItemSelect}>
            <div className='icon-sprite' style={imgStyle}></div>
            <div className='item-name'>{items[props.name]['name']}</div>
            <p className='item-desc'>{props.desc}</p>
        </div>
    );
}

function Search(props) {
    function handleSearchChange(e) {
        // updates search state in Party to update move/item List
        props.handleSearch(e.target.value); 
    }

    return (
        <div className='move-search'>
            <div className='search-label'>Search</div>
            <input onChange={handleSearchChange}></input>
        </div>
    );
}

export default Party;