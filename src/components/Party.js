import React from 'react';
import PartyPkmn from './PartyPkmn';
import './styles/Party.css';
import pokedex from './utils/pokedex.json';
import itemIcon from '../img/itemicons.png';
import moves from './utils/moves.json';
import items from './utils/items.json';

class Party extends React.Component {
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
                const pokemonData = pokemon ? pokedex[pokemon] : null;

                return (
                    <PartyPkmn key={slotNum}
                        slot={slotNum}
                        pokemon={pokemon}
                        moves={moves}
                        item={item}
                        display={display['mode']}
                        pokemonData={pokemonData}
                        onPartyPkmnClick={this.props.onPartyPkmnClick}
                        onReturnClick={this.props.onReturnClick}
                        onRemoveClick={this.props.onRemoveClick}
                        onMoveClick={this.props.onMoveClick}
                        onItemClick={this.props.onItemClick}
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

            let displayList;
            if (display['mode'] == 'moves') { // when adding or changing a move
                displayList = Object.entries(moves).map((move, index) => {
                    const name     = move[0];
                    const type     = move[1]['type'];
                    const category = move[1]['category'];
                    const power    = move[1]['power'];
                    const accuracy = move[1]['accuracy'];

                    return (
                        <Move key={index}
                        name={name}
                        type={type}
                        category={category}
                        power={power}
                        accuracy={accuracy}
                        onMoveSelect={this.props.onMoveSelect}
                        />
                    )
                });
            } 
            else if (display['mode'] == 'items') { // when adding or changing an item
                displayList = Object.entries(items).map((item, index) => {
                    const name = item[0];
                    const icon = item[1]['spriteNum'];
                    const desc = item[1]['desc'];

                    return (
                        <Item key={index} 
                        name={name}
                        icon={icon}
                        desc={desc}
                        onItemSelect={this.props.onItemSelect}
                        />
                    )
                });
            }

            // final display of pokemon followed by selection list
            partyDisplay = (
                <div className='select-party-pkmn'>
                    <PartyPkmn slot={slot}
                        pokemon={pokemon}
                        moves={this.props.party[slot].moves}
                        item={this.props.party[slot].item}
                        pokemonData={pokedex[pokemon]}
                        display={display['mode']}
                        moveSlot={display['moveSlot']}
                        onPartyPkmnClick={this.props.onPartyPkmnClick}
                        onReturnClick={this.props.onReturnClick}
                        onRemoveClick={this.props.onRemoveClick}
                        onMoveClick={this.props.onMoveClick}
                        onItemClick={this.props.onItemClick}
                    />
                    <div className={`${display['mode']}-list`}>{displayList}</div>
                </div>
            );
        }

        return (
            <div className='party wrapper'>
                <div className="party display">
                    {partyDisplay}
                </div>
            </div>
        );
    }
}

function Move(props) {
    function handleMoveSelect(e) {
        props.onMoveSelect(props.name);
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

function Item(props) {
    function handleItemSelect(e) {
        props.onItemSelect(props.name);
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
            <div className='item-name'>{props.name}</div>
            <p className='item-desc'>{props.desc}</p>
        </div>
    );
}

export default Party;