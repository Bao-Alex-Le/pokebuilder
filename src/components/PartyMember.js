import React from 'react';
import Stats from './Stats';
import './styles/PartyMember.css';

class PartyMember extends React.Component {
    constructor(props) {
        super(props);

        this.handlePartyMemberClick = this.handlePartyMemberClick.bind(this);
    }

    handlePartyMemberClick(e) {
        this.props.onPartyMemberClick(this.props.slot);
    }

    render() {
        const pokemonData = this.props.pokemonData;

        let pokemonImg;
        let abilityList;
        if (pokemonData) {
            pokemonImg = this.props.pokemon.replace(':','').replace('%','');
        
            abilityList = pokemonData['abilities'].map((ability, index) => {
                if (ability) return <option key={index} value={ability}>{ability}</option>;
            });
        }

        return (
            <div className={'party-member ' + this.props.slot}>
                { pokemonData // check whether a pokemon is occupying this party slot
                    ? // render Pokemon sprite image and data for types, stats, etc.
                    <div className='party-slot'>
                        <div className='icon'>
                            <img src={require(`../img/HDsprites/${pokemonImg}.png`)} onClick={this.handlePartyMemberClick}/>
                            <h5>{this.props.pokemon}</h5>
                        </div>
                        <div className='options'>
                            <div className='party-member-types'>
                                { pokemonData['type1']
                                    ? <img src={ require(`../img/types/${pokemonData['type1']}.png`) }/>
                                    : null
                                }
                                { pokemonData['type2']
                                    ? <img src={ require(`../img/types/${pokemonData['type2']}.png`) }/>
                                    : null
                                }
                            </div>
                            <div className='ability'>
                                <p>Ability</p>
                                <select className='ability-select'>
                                    {abilityList}
                                </select>
                            </div>
                            <div className='item'>
                                <p>Item</p>
                            </div>
                        </div>
                        <div className='move-list'>
                            <div className='move-title'>Moves</div>
                            <div className='top row'>
                                <div className='move 1'>1</div>
                                <div className='move 2'>2</div>
                            </div>
                            <div className='bottom row'>
                                <div className='move 3'>3</div>
                                <div className='move 4'>4</div>
                            </div>
                        </div>
                        <Stats stats={pokemonData['stats']}/>
                    </div>
                    : // render placeholder indicating empty party slot
                    <div className='empty-slot'>
                        <img src={require(`../img/HDsprites/pokeball.png`)}/>
                    </div>
                }
            </div>
        );
    }
}

export default PartyMember;