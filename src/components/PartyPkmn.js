import React from 'react';
import { useRef, useEffect } from 'react';
import Stats from './Stats';
import './styles/PartyPkmn.css';
import moveData from './utils/moves.json';

class PartyPkmn extends React.Component {
    constructor(props) {
        super(props);

        this.handlePartyPkmnClick = this.handlePartyPkmnClick.bind(this);
        this.handleReturnClick = this.handleReturnClick.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);

        this.ref = React.createRef();
    }

    componentDidMount() {
        if (this.props.display == 'items') {
            this.ref.current.focus();
        }
    }

    handlePartyPkmnClick(e) {
        this.props.onPartyPkmnClick(this.props.slot);
    }

    handleReturnClick(e) {
        this.props.onReturnClick();
    }

    handleRemoveClick(e) {
        this.props.onRemoveClick(this.props.slot);
    }

    handleItemClick(e) {
        const pokemon = this.props.pokemon;
        const slot = this.props.slot;
        this.props.onItemClick(pokemon, slot);
    }

    render() {
        const pokemonData = this.props.pokemonData;

        let pokemonImgName;
        let imageStyle;
        let abilityList;
        if (pokemonData) {
            pokemonImgName = this.props.pokemon.replaceAll(':','').replaceAll('%','');
            const pokemonImg = require(`../img/HDsprites/${pokemonImgName}.png`).replaceAll(' ', '%20').replaceAll('\'', '%27');
            const justifyContent = this.props.display == 'party' ? 'flex-end' : 'space-between';

            imageStyle = { // setting style for div containing pokemon image
                width: '120px',
                height: '120px',
                margin: '5px',
                border: '2px solid transparent',
                borderRadius: '100%',
                backgroundImage: `url(${pokemonImg})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: justifyContent
            }
        
            abilityList = pokemonData['abilities'].map((ability, index) => { 
                if (ability) return <option key={index} value={ability}>{ability}</option>;
            });
        }

        const empty = pokemonData ? 'filled': 'empty';

        return (
            <div className={'party pkmn ' + this.props.slot + ' ' + empty}>
                { pokemonData // check whether a pokemon is occupying this party slot
                    ? // render Pokemon sprite image and data for types, stats, etc.
                    <div className='party slot filled'>
                        <div className='party icon'>
                            <div className='remove' onClick={this.handleRemoveClick}></div>
                            <div className="icon sprite name">
                                <div className='icon-image' style={imageStyle} onClick={this.handlePartyPkmnClick} ref={this.ref} tabIndex='0'></div>
                                <h5 className='party pkmn-name'>{this.props.pokemon}</h5>
                            </div>
                            { this.props.display == 'party'
                                ? <div className='return-placeholder'> </div>
                                : <div className='return' onClick={this.handleReturnClick}></div>}
                        </div>
                        <div className='options'>
                            <div className='party-pkmn-types'>
                                { pokemonData['type1']
                                    ? <img src={ require(`../img/types/gen8/${pokemonData['type1']}.png`) }/>
                                    : null
                                }
                                { pokemonData['type2']
                                    ? <img src={ require(`../img/types/gen8/${pokemonData['type2']}.png`) }/>
                                    : null
                                }
                            </div>
                            <div className='ability'>
                                <p className='ability-label'>Ability</p>
                                <select className='ability-select'>
                                    {abilityList}
                                </select>
                            </div>
                            <div className='pkmn-item'>
                                <p className='item-label'>Item</p>
                                <div className={`item-select ${this.props.slot} ${this.props.pokemon.replaceAll(' ', '%20')}`} 
                                    onClick={this.handleItemClick} 
                                    ref={this.ref}
                                    tabIndex='0'
                                >
                                    <p>{this.props.item}</p>
                                </div>
                            </div>
                        </div>
                        <Moves slot={this.props.slot}
                            onMoveClick={this.props.onMoveClick}
                            pokemon={this.props.pokemon}
                            moves={this.props.moves}
                            moveSlot={this.props.moveSlot}
                            ref={this.props.ref}/>
                        <Stats stats={pokemonData['stats']}/>
                    </div>
                    : // render placeholder indicating empty party slot
                    <div className={`party slot empty ${this.props.slot}`} onClick={this.handlePartyPkmnClick} ref={this.ref} tabIndex='0'>
                        <img src={require(`../img/HDsprites/pokeball.png`)}/>
                    </div>
                }
            </div>
        );
    }
}

function Moves(props) {
    const moveList = Object.entries(props.moves).map((move, index) => {
        let moveItem;
        if (index+1 == props.moveSlot) {
            moveItem = (
                <Move key={move[0]}
                    moveSlot={move[0]}
                    move={move[1]}
                    pokemon={props.pokemon}
                    slot={props.slot}
                    onMoveClick={props.onMoveClick}
                    clicked={true}
                    ref={props.ref}/>
            );
        } else {
            moveItem = (
                <Move key={move[0]}
                    moveSlot={move[0]}
                    move={move[1]}
                    pokemon={props.pokemon}
                    slot={props.slot}
                    onMoveClick={props.onMoveClick}
                    clicked={false}/>
            );
        }
        return moveItem;    
    });

    return (
        <div className='pkmn-moves'>
            <div className='move-title'>Moves</div>
            <div className='move-rows'>
                <div className='top row'>
                    {moveList[0]}{moveList[1]}
                </div>
                <div className='bottom row'>
                    {moveList[2]}{moveList[3]}
                </div>
            </div>
        </div>
    );
}

function Move(props) {
    const moveSlot = useRef(null);
    function handleMoveClick(e) {
        moveSlot.current.focus();
        props.onMoveClick(props.pokemon, props.slot, props.moveSlot);
    }
    
    useEffect(() => {
        if (props.clicked) {
            moveSlot.current.focus();
        }
    });
    
    let display;
    const pokemonClass = props.pokemon.replaceAll(' ', '%20');
    if (props.move) {
        const data     = moveData[props.move];
        const type     = data.type;
        const category = data.category;
        const power    = data.power;
        const accuracy = data.accuracy;

        display = (
            <div className={`move-slot ${props.moveSlot} ${props.slot} ${pokemonClass}`} 
                ref={moveSlot} 
                onClick={handleMoveClick} 
                tabIndex='0'
            >
                <div className='move-name'>{props.move}</div>
                <div className='move-type'>
                    <img src={require(`../img/types/${type}.png`)}/>
                    <img src={require(`../img/types/${category}.png`)}/>
                </div>
                <div className='move-stats'>
                    <span className='stat pow'>
                        <span className='text pow'>Pwr.</span>
                        <span className='pow'>{power}</span>
                    </span>
                    <span className='stat acc'>
                        <span className='text acc'>Acc.</span>
                        <span className='acc'>{accuracy}</span>
                    </span>
                </div>
            </div>
        );
    } else {
        display = (
            <div className={`empty move-slot ${props.moveSlot} ${props.slot} ${pokemonClass}`} 
                ref={moveSlot} 
                onClick={handleMoveClick} 
                tabIndex='0'>
            </div>
        );
    }

    return (
        display
    );
}

export default PartyPkmn;