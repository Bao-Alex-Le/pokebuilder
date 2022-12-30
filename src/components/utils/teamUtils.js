import moves from './moves.json';
import pokedex from './pokedex.json';
import items from './items.json';

function formatTeam(party) {
    let formatTeam = '';
    Object.keys(party).forEach(slot => {
        if (party[slot]['name']) {
            const data        = party[slot];
            const pokemonData = pokedex[data['name']];
            const name        = pokemonData['name'];
            const moveset     = data['moves'];
            const item        = data['item'];
            const ability     = data['ability'];
            const tera        = data['tera'];
    
            let pokemonText = '';
            pokemonText += `${name}`;
            pokemonText += item ? ` @ ${items[item]['name']}\n` : '\n';
            pokemonText += `Ability: ${ability}\n`;
            pokemonText += `Tera Type: ${tera}\n`
            Object.keys(moveset).forEach(moveSlot => {
                const moveName = moveset[moveSlot];
                if (moveName) {
                    pokemonText += `- ${moves[moveName]['name']}\n`;
                }
            });
            pokemonText += '\n';
    
            formatTeam += pokemonText;
        }
    });

    return formatTeam;
}

function validateTeam(importText) {
    const splitTeam = importText.split('\n\n');
    let newParty = {};
    let partySlot = 1;
    let invalid = false;
    splitTeam.forEach(pokemonData => {
        let name, item='', ability='', tera='Normal', pkmnData;
        let pkmnMoves = {};

        if (pokemonData) {
            let moveSlot = 1;
            const splitData = pokemonData.split('\n');
            for (let i = 0; i < splitData.length; i++) {
                const data = splitData[i].trim();
                if (i == 0) {
                    let split = data.split('@');
                    name = split[0].trim().toLowerCase().replaceAll(' ', '').replaceAll(String.fromCharCode('9792'), 'f').replaceAll(String.fromCharCode('9794'), 'm').replaceAll('\'', '').replaceAll('.', '').replaceAll('-','').replaceAll('%', '').replaceAll(':', '');
                    name = name.split('(')[0];
                    if (!pokedex[name]) {
                        console.log(name);
                        invalid = true;
                        break;
                    }
                    pkmnData = pokedex[name];
                    if (split.length > 1) {
                        const testItem = split[1].trim().toLowerCase().replaceAll(' ', '').replaceAll('\'', '').replaceAll('-', '');
                        if (items[testItem]) {
                            item = testItem;
                        }
                        continue;
                    }
                }

                if (data[0] == '-') {
                    let move = data.slice(1, data.length).trim();
                    const fmove = move.toLowerCase().replaceAll(' ', '').replaceAll(',', '').replaceAll('-', '').replaceAll('\'', '');
                    if (moves[fmove]) {
                        pkmnMoves[moveSlot++] = fmove;
                        continue;
                    }
                }

                let split = data.split(':');
                if (split[0].trim().toLowerCase() == 'ability') {
                    const testAbility = split[1].trim().toLowerCase().replaceAll(' ', '');
                    pkmnData['abilities'].forEach(pkmnAbility => {
                        const fAbility = pkmnAbility.trim().toLowerCase().replaceAll(' ', '');
                        if (testAbility == fAbility) {
                            ability = pkmnAbility;
                        }
                    });
                }

                if (split[0].trim().toLowerCase().replaceAll(' ', '') == 'teratype') {
                    const types = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
                    const teraType = split[1].trim().toLowerCase().replaceAll(' ', '');
                    const type = types.find(type => {
                        if (type.toLowerCase() == teraType) return true;
                    });
                    tera = type ? type : 'Normal';
                }
            }

            while (moveSlot <= 4) {
                pkmnMoves[moveSlot++] = '';
            }
        }

        if (!invalid && partySlot <= 6) {
            newParty[partySlot++] = {
                name: name,
                moves: pkmnMoves,
                item: item,
                ability: ability,
                tera: tera
            }
        }
    });

    if (invalid) {
        newParty = null;
    } else {
        while (partySlot <= 6) {
            newParty[partySlot++] = {
                name: '',
                moves: {'1': '', '2': '', '3': '', '4': ''},
                item: '',
                ability: '',
                tera: 'Normal'
            }
        }
    }
    
    return newParty;
}

export { formatTeam, validateTeam };