import React from 'react';
import './styles/Analysis.css';
import { typeColours, typeChart, typeIndices } from './utils/typeData';
import { getPkmnSprite } from './utils/pkmnData';
import pokedex from './utils/pokedex.json';
import moves from './utils/moves.json';
import { getBarColor, getBarVal, statDict } from './Stats';

/**
 *  Analysis interface that replaces the pokedex when selected
 *  Displays data on party weaknesses and strengths
 */

class Analysis extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            party: {
                '0': true,
                '1': true,
                '2': true,
                '3': true,
                '4': true,
                '5': true
            },
            tera: {
                '0': false,
                '1': false,
                '2': false,
                '3': false,
                '4': false,
                '5': false
            }
        }

        this.handlePkmnToggle = this.handlePkmnToggle.bind(this);
        this.handleTeraToggle = this.handleTeraToggle.bind(this);
    }

    handlePkmnToggle(slot) {
        const newParty = this.state.party;
        newParty[slot] = !newParty[slot];
        this.setState({ newParty });
    }

    handleTeraToggle(slot) {
        const newTera = this.state.tera;
        newTera[slot] = !newTera[slot];
        this.setState({ newTera });
    }

    /**
     *  returns an array of length = 6 with the defensive resistances/weaknesses of each party member
     */
    findPartyDefenses(party) {
        let defenses;
        if (party) {
            defenses = party.reduce((result, pokemon, index) => {
                if (!pokemon.name) return result;
                if (!this.state.party[index]) return result;
                const stats = pokedex[pokemon.name];
                const type1 = this.state.tera[index] ? pokemon.tera.toLowerCase() : stats.type1.toLowerCase();
                const type2 = this.state.tera[index] ? null : stats.type2.toLowerCase();

                if (!type2) {
                    result.push([pokemon.name, typeChart[type1]])
                    return result;
                }

                // Calculates and creates matchup table for pokemon with 2 types
                const type1defenses = typeChart[type1];
                const type2defenses = typeChart[type2];
                const typeDefenses = [];
                for (let i = 0; i < type1defenses.length; i++) {
                    // Combines multipliers for the two types and pushes to combined matchup array
                    typeDefenses.push(type1defenses[i] * type2defenses[i]);
                }

                result.push([pokemon.name, typeDefenses]);
                return result;
            }, []);
        } else {
            defenses = [];
        }

        // filler for empty party slots
        while (defenses.length < 6) {
            defenses.push(['', [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]);
        }
        return defenses;
    }

    /**
     *  returns an object with the total weaknesses, resistance, and immunities of full pokemon party
     */
    findDefenseTotals(defenses) {
        const weaknesses =  [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];
        const resistances = [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];
        const immunities =  [  0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0];
        for (let i = 0; i < defenses[0][1].length; i++) {
            defenses.forEach(defense => {
                if (defense[1][i] == 0) {
                    immunities[i]++;
                    return;
                } else if (defense[1][i] < 1) {
                    resistances[i]++;
                    return;
                } else if (defense[1][i] > 1) {
                    weaknesses[i]++;
                    return;
                }
            });
        }

        const defenseTotals = {
            'weak': weaknesses,
            'resist': resistances,
            'immune': immunities
        }
        return defenseTotals;
    }

    /**
     *  parses through each move for each pokemon in party
     *  returns object of party move effectiveness against each type
     */
    findOffensiveCoverage(party) {
        const typeList = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
        
        const offenseData = {
            effective: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            ineffective: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            bestMoves: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]
        }

        typeList.forEach(type => {
            const typeIndex = typeIndices[type];

            // for each pokemon in party
            Object.keys(party).forEach((slot, index) => {
                if (!this.state.party[index]) return;
                const pokemon = party[slot]['name'];
                const pokemonMoves = party[slot]['moves'];
                const pkmnData = pokedex[pokemon];
                const atkTypes = this.state.tera[index] ? [party[slot]['tera']] : [pkmnData['type1'], pkmnData['type2']];

                // for each pokemon's move
                if (pokemon) {
                    Object.keys(pokemonMoves).forEach(moveSlot => {
                        if(pokemonMoves[moveSlot]) {
                            // calculate move damage against current type
                            const move = pokemonMoves[moveSlot];
                            const movePower = calcMoveDamage(move, type, atkTypes);

                            // adding to offensive totals
                            if (movePower[1] > 1) {
                                offenseData.effective[typeIndex]++;
                            } else if (movePower[1] < 1) {
                                offenseData.ineffective[typeIndex]++;
                            }
    
                            // check if move is currently best move against current type
                            const bestMove = offenseData.bestMoves[typeIndex] ? offenseData.bestMoves[typeIndex] : null;
                            if (!bestMove) {
                                offenseData.bestMoves[typeIndex] = [pokemon, move, atkTypes, movePower[2]];
                            } else {
                                const bestPower = calcMoveDamage(bestMove[1], type, bestMove[2]);
                                if (movePower[0] > bestPower[0]) {
                                    offenseData.bestMoves[typeIndex] = [pokemon, move, atkTypes, movePower[2]];
                                }
                            }
                        }
                    });

                }

            });

        });

        return offenseData;
    }

    render() {
        const party = Object.values(this.props.party).filter((pokemon, index) => {
            if (pokemon.name) return true;
        });
        const partyNames = party.map(pkmn => {
            if (pkmn) return pkmn.name;
        });

        const defenses = this.findPartyDefenses(party);
        const defenseTotals = this.findDefenseTotals(defenses);
        const offenseData = this.findOffensiveCoverage(party);

        return (
            <div className='analysis-container-outer'>
                <div className='analysis-container'>
                    <div className='analysis-party'>
                        <div className='party-header'>
                            <div className='close-placeholder'></div>
                            <h2>Party</h2>
                            <div className='close-analysis' onClick={this.props.onCloseClick}></div>
                        </div>
                        <AnalysisParty party={party} onPkmnToggle={this.handlePkmnToggle} onTeraToggle={this.handleTeraToggle} partyState={this.state.party} teraState={this.state.tera}/>
                    </div>
                    <div className='defense'>
                        <h2>Defenses</h2>
                        <DefenseTable defenses={defenses}/>
                        <h2>Totals</h2>
                        <DefenseTotalTable defenseTotals={defenseTotals}/>
                    </div>
                    <div className='offense'>
                        <h2>Offensive Coverage</h2>
                        <OffenseTable effective={offenseData.effective} ineffective={offenseData.ineffective}/>
                        <h2>Best Moves</h2>
                        <BestMoves bestMoves={offenseData.bestMoves}/>
                    </div>
                    <div className='best-stats'>
                        <h2>Stats</h2>
                        <BestStats party={partyNames} analysisState={this.state.party}/>
                    </div>
                </div>
            </div>
        );
    }
}

function AnalysisParty(props) {
    function handlePkmnToggle(e) {
        props.onPkmnToggle(e.target.value.toString());
    }

    function handleTeraToggle(e) {
        props.onTeraToggle(e.target.value.toString());
    }

    const party = props.party;
    const partyState = props.partyState;
    const teraState = props.teraState;
    const partyList = party.map((pkmn, index) => {
        const sprite = getPkmnSprite(pkmn.name);
        const pkmnData = pokedex[pkmn.name];

        const type1 = teraState[index] 
                        ? (<img src={ require(`../img/types/${pkmn.tera}.png`) }/>)
                        : (<img src={ require(`../img/types/${pkmnData['type1']}.png`) }/>);
        const type2 = (pkmnData['type2'] && !teraState[index])
                        ? (<img src={ require(`../img/types/${pkmnData['type2']}.png`) }/>)
                        : null;
        const types = [type1, type2];

        return (
            <label className='analysis-pkmn' for={`slot${index}`} key={index}>
                <label for={`slot${index}`}>{sprite}</label>
                {
                    partyState[index]
                        ? <input type="checkbox" 
                                id={`slot${index}`}
                                name={`slot${index}`}
                                value={index}
                                onChange={handlePkmnToggle}
                                checked>
                            </input>
                        : <input type="checkbox" 
                                id={`slot${index}`}
                                name={`slot${index}`}
                                value={index}
                                onChange={handlePkmnToggle}>
                            </input>
                }
                <label for={`slot${index}`}>
                    <div className='analysis-party-types'>
                        {types}
                    </div>
                </label>
            </label>
        );
    });
    
    const teraList = party.map((pkmn, index) => {
        const teraType = pkmn['tera'];

        return (
            <label className='tera-toggle' for={`tera${index}`} key={index}>
                <label className='tera-toggle-type' for={`tera${index}`}>
                    <img src={ require(`../img/types/${teraType}.png`) }/>
                </label>
                {
                    teraState[index]
                        ? <input type="checkbox" 
                                id={`tera${index}`}
                                name={`tera${index}`}
                                value={index}
                                onChange={handleTeraToggle}
                                checked>
                            </input>
                        : <input type="checkbox" 
                                id={`tera${index}`}
                                name={`tera${index}`}
                                value={index}
                                onChange={handleTeraToggle}>
                            </input>
                }
            </label>
        );
    });

    return (
        <div className='analysis-party-container'>
            <div className='analysis-party-select'>
                {partyList}
            </div>
            <h4>Enable Tera</h4>
            <div className='analysis-tera-select'>
                {teraList}
            </div>
        </div>
    );
}

function DefenseTableHeaders(props) {
    const firstHeader = props.label 
        ? ( <div className='table-header label cell'>{props.label}</div> )
        : ( <div className='table-header pokeball cell' key='0'><img src={ require(`../img/pokeball.png`) }/></div> );

    const typeList = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

    const cellClass = props.cellClass ? props.cellClass : 'table-header cell';
    let key = 1;
    const typeHeaders = typeList.map(type => {
        return (
            <div className={cellClass} key={key++}><img src={ require(`../img/types/${type}.png`) }/></div>
        );
    });

    return (
        <div className='table-headers'>
            { (props.label !== 'none') ? firstHeader : null }
            {typeHeaders}
        </div>
    );
}

/**
 *  JSX table for displaying type defensive effectiveness
 *  populates list DefenseTableRow elements as rows for the table
 */
function DefenseTable(props) {
    let key = 0;
    const tableRows = props.defenses.map(defense => {
        const pokemon = defense[0];
        const pokemonDefenses = defense[1];
        return <DefenseTableRow pokemon={pokemon} defenses={pokemonDefenses} key={key++}/>;
    });
    
    return (
        <div className='defense-table'>
            <DefenseTableHeaders/>
            {tableRows}
        </div>
    );
}

function DefenseTableRow(props) {
    const typeList = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
    
    const pokemon = props.pokemon;
    const sprite = getPkmnSprite(pokemon);
    const defenseData = props.defenses;

    let key = 0;
    const defenseTableRow = typeList.map(type => {
        const i = typeIndices[type.toLowerCase()];
        const multiplier = defenseData[i];

        let label;
        let multiplierClass;
        if (multiplier == 1) {
            label = '-';
        } else if (multiplier == 0.25) {
            label = '\u00BC';
            multiplierClass = 'quarter';
        } else if (multiplier == 0.5) {
            label= '\u00BD';
            multiplierClass = 'half';
        } else if (multiplier == 2) {
            label = '2';
            multiplierClass = 'double';
        } else if (multiplier == 4) {
            label = '4';
            multiplierClass = 'quadruple';
        } else if (multiplier == 0) {
            label = '0';
            multiplierClass = 'immune';
        }

        return (
            <div className='matchup cell' key={key++}>
                <div className={`multiplier ${multiplierClass}`}>{label}</div>
            </div>
        );
    });

    return (
        <div className='defense-table-row'>
            <div className='table-sprite'>
                {sprite}
            </div>
            {defenseTableRow}
        </div>
    );
}

function DefenseTotalTable(props) {
    const defenseTotals = props.defenseTotals;
    let tableRows = [];
    Object.keys(defenseTotals).forEach(total => {
        tableRows.push(<DefenseTotalRow label={total} data={defenseTotals[total]}/>);
    });

    return (
        <div className="defense-table">
            <DefenseTableHeaders label="Total"/>
            {tableRows}
        </div>
    );
}

function DefenseTotalRow(props) {
    const label = props.label;
    const data = props.data;

    const valueColor = (category, value) => {
        let color;
        if (category == 'weak') {
            value = value > 3 ? 3 : value;
            switch (value) {
                case 0:
                    color = 'limegreen';
                    break;
                case 1:
                    color = 'greenyellow';
                    break;
                case 2:
                    color = 'yellow';
                    break;
                case 3:
                    color = 'orangered';
                    break;
            }
        } else if (category == 'resist') {
            value = value > 3 ? 3 : value;
            switch (value) {
                case 0:
                    color = 'orangered';
                    break;
                case 1:
                    color = 'greenyellow';
                    break;
                case 2:
                    color = 'greenyellow';
                    break;
                case 3:
                    color = 'limegreen';
                    break;
            }
        } else if (category == 'immune') {
            value = value > 1 ? 1 : value;
            switch (value) {
                case 0:
                    color = 'orangered';
                    break;
                case 1:
                    color = 'limegreen';
                    break;
            }
        }
        return color;
    } 

    const defenseTotalRow = data.map(value => {
        const style = {
            'fontSize': '18px',
            'fontWeight': 'bold',
            'color': valueColor(label, value)
        }

        return (
            <div className='matchup cell'>
                    <div className='total-value' style={style}>{value}</div>
            </div>
        );
    });

    return (
        <div className='defense-table-row'>
            <div className='total-table label'>
                {label}
            </div>
            {defenseTotalRow}
        </div>
    );
}

// calculates move damage, taking into account things like STAB (same type attack bonus)
function calcMoveDamage(move, defType, atkTypes) {
    const moveData = moves[move];
    const power = moveData['power'];
    const moveType = moveData['type'];

    const stab = atkTypes.findIndex(type => type == moveType) >= 0 ? 1.5 : 1;
    const typeMultiplier = typeChart[defType][typeIndices[moveData['type'].toLowerCase()]];
    const effectivePower = parseInt(power) ? Math.round(parseInt(power) * typeMultiplier * stab) : 0;

    const boost = stab > 1 ? true : false;
    return [effectivePower, typeMultiplier, boost];
}

/**
 *  Table that displays total effective and ineffective moves against every type
 */
function OffenseTable(props) {
    const effective = props.effective;
    const ineffective = props.ineffective;

    let key = 0;
    const effectiveTable = effective.map(value => {
        const cellClass = value > 0 ? 'total-value limegreen' : 'total-value';
        return (
            <div className='super-effective cell' key={key++}>
                <div className={cellClass}>{value}</div>
            </div>
        );
    });

    key = 0;
    const ineffectiveTable = ineffective.map(value => {
        const cellClass = value > 0 ? 'total-value double' : 'total-value';
        return (
            <div className='notvery-effective cell' key={key++}>
                <div className={cellClass}>{value}</div>
            </div>
        );
    });

    return (
        <div className='offense-container'>
            
            <div className='super-eff'>
                <h4>Super Effective</h4>
                <div className='offense-table'>
                    <DefenseTableHeaders label='none' cellClass='row-header'/>
                    <div className='row'>
                        {effectiveTable}
                    </div>
                </div>
            </div>
            
            <div className='not-eff'>
                <h4>Not Very Effective</h4>
                <div className='offense-table'>
                    <DefenseTableHeaders label='none' cellClass='row-header'/>
                    <div className='row'>
                        {ineffectiveTable}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 *  Displays each of party's best move against each type
 */
function BestMoves(props) {
    const typeList = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];
    const bestMoves = props.bestMoves;

    let bestMoveList = [];
    for (let i = 0; i < bestMoves.length; i++) {
        if (bestMoves[i]) {
            const pokemon = bestMoves[i][0];
            const move = moves[bestMoves[i][1]];
            const boost = bestMoves[i][3];
            const defType = typeList[i];
            const defTypeCap = defType[0].toUpperCase() + defType.slice(1); 
    
            // move data
            const name = move['name'];
            const type = move['type'];
            const power = move['power'];
            const acc = move['accuracy'];
            const cat = move['category'];
            const sprite = getPkmnSprite(pokemon);
    
            // calculating multiplier value and setting class for css
            const multiplier = typeChart[defType][typeIndices[type.toLowerCase()]];
            let multiplierClass = 'best-multiplier yellow'; 
            if (multiplier < 1) multiplierClass = 'best-multiplier double';
            else if (multiplier > 1) multiplierClass = 'best-multiplier limegreen';
            const powClass = boost ? 'best-pow limegreen' : 'best-pow'; 

            const defTypeStyle = {
                'height': '22px',
                'backgroundColor': typeColours[defType][2],
                'backgroundSize': 'contain',
                'borderTopRightRadius': '5px',
                'borderTopLeftRadius': '5px'
            }
    
            bestMoveList.push(
                <div className='best-move'>
                    <div className='best-move-deftype' style={defTypeStyle}>
                            <img src={require(`../img/types/gen8/${defTypeCap}.png`)}/>
                    </div>
                    <div className='best-move-head'>
                        <div className='table-sprite'>
                            {sprite}
                        </div>
                        <div className='best-move-name'>{name}</div>
                    </div>
                    <div className='best-move-body'>
                        <div className='best-move-type'>
                            <img src={require(`../img/types/${type}.png`)}/>
                            <img src={require(`../img/types/${cat}.png`)}/>
                        </div>
                        <div className='best-move-stats'>
                            <span className='stat pow'>
                                <span className='text pow'>Pwr.</span>
                                <span className={powClass}>{power}</span>
                            </span>
                            <span className='stat acc'>
                                <span className='text acc'>Acc.</span>
                                <span className='best-acc'>{acc}</span>
                            </span>
                        </div>
                        <div className={multiplierClass}>x{multiplier}</div>
                    </div>
                    
                </div>
            );
        }  
    }

    const noBestMoves = (
        <div className='no-best-moves'>No moves selected</div>
    );

    return (
        <div className='best-moves-container'>
            <div className='best-moves'>
                {bestMoveList.length > 0 ? bestMoveList : noBestMoves}
            </div>
        </div>
    );
}

function BestStats(props) {
    const party = props.party;
    const state = props.analysisState;

    let highests = {'hp': [0, null], 'attack': [0, null], 'defense': [0, null], 'sp_attack': [0, null], 'sp_defense': [0, null], 'speed': [0, null]};
    let averages = {'hp': [0], 'attack': [0], 'defense': [0], 'sp_attack': [0], 'sp_defense': [0], 'speed': [0]};
    let lowests = {'hp': [0, null], 'attack': [0, null], 'defense': [0, null], 'sp_attack': [0, null], 'sp_defense': [0, null], 'speed': [0, null]};
    if (party.length) {
        party.forEach((pkmn, index) => {
            if (state[index]) {
                const pkmnData = pokedex[pkmn];
                const stats = pkmnData['stats'];
        
                Object.keys(stats).forEach(stat => {
                    const statValue = parseInt(stats[stat]);
                    if (statValue > highests[stat][0]) {
                        highests[stat][0] = stats[stat];
                        highests[stat][1] = pkmn;
                    }
                    if (statValue < lowests[stat][0] || lowests[stat][0] == 0) {
                        lowests[stat][0] = stats[stat];
                        lowests[stat][1] = pkmn;
                    }
        
                    averages[stat][0] = averages[stat][0] + statValue;
                });
            }
        });

        Object.keys(averages).forEach(stat => {
            averages[stat][0] = Math.round(averages[stat][0] / party.length);
        });
    }

    return (
        <div>
            <div className='best-stats-container'>
                <h4>Highests</h4>
                <StatsTable data={highests}/>
                <h4>Averages</h4>
                <StatsTable data={averages}/>
                <h4>Lowests</h4>
                <StatsTable data={lowests}/>
            </div>
        </div>
    );
}

function StatsTable(props) {
    const data = props.data;
    const showSprites = props.showSprites;

    const rows = Object.keys(data).map(stat => {
        const value = data[stat][0];
        const sprite = data[stat][1] ? getPkmnSprite(data[stat][1]) : null;

        const barVal = getBarVal(stat, value);
        const barCol = getBarColor(barVal);
        const statBarStyle = {
            width: `${barVal}%`,
            height: '50%',
            backgroundColor: barCol,
            borderRadius: '3px'
        }

        const valueStyle = {
            color: barCol,
            fontSize: '17px',
            fontWeight: 'bold'
        }

        return (
            <div className='stat-cell'>
                <div className='stat-head'>
                    { sprite ? <div className='table-sprite'>{sprite}</div> : null }
                    <div>{statDict[stat]['full']}</div>
                    <div style={valueStyle}>{value}</div>
                </div>
                <div className='stat-meter'>
                    <span style={statBarStyle}></span>
                </div>
            </div>
        );
    });

    return (
        <div className='stat-table'>
            {rows}
        </div>
    );
}

export default Analysis;