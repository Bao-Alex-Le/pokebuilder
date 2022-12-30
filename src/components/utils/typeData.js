const typeColours = {
    normal: ['#96966b', '#d1d1b6', '#4c4f52'],
    fire: ['#f77c20', '#f2a56d', '#5f4f44'],
    water: ['#3d68c4', '#6390F0', '#414e5a'],
    electric: ['#ffe600', '#fff6a3', '#5d5841'],
    grass: ['#7AC74C', '#b2ff85', '#445447'],
    ice: ['#35d4cd', '#beedeb', '#475757'],
    fighting: ['#C22E28', '#e65850', '#56404a'],
    poison: ['#A33EA1', '#c75fc5', '#524857'],
    ground: ['#a68b47', '#d4bb7d', '#5b4c43'],
    flying: ['#A98FF3', '#bba6f7', '#4c525a'],
    psychic: ['#ff3d78', '#fc88ac', '#5d484a'],
    bug: ['#A6B91A', '#d2e643', '#4c543f'],
    rock: ['#cfaf0e', '#e3d178', '#57544f'],
    ghost: ['#735797', '#936ec2', '#414852'],
    dragon: ['#6F35FC', '#8654ff', '#364857'],
    dark: ['#664f3f', '#917866', '#44444a'],
    steel: ['#9c9cba', '#d1d1e0', '#444c52'],
    fairy: ['#ff8ada', '#ffbdea', '#5d4e5d']
};

const typeList = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];

const typeChart = {
    // types  [nor, fir, wat, ele, gra, ice, fig, poi, gro, fly, psy, bug, roc, gho, dra, dar, ste, fai]
    normal:   [  1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   1,   1,   1,   0,   1,   1,   1,   1],
    fire:     [  1,  .5,   2,   1,  .5,  .5,   1,   1,   2,   1,   1,  .5,   2,   1,   1,   1,  .5,  .5],
    water:    [  1,  .5,  .5,   2,   2,  .5,   1,   1,   1,   1,   1,   1,   1,   1,   1,   1,  .5,   1],
    electric: [  1,   1,   1,  .5,   1,   1,   1,   1,   2,  .5,   1,   1,   1,   1,   1,   1,  .5,   1],
    grass:    [  1,   2,  .5,  .5,  .5,   2,   1,   2,  .5,   2,   1,   2,   1,   1,   1,   1,   1,   1],
    ice:      [  1,   2,   1,   1,   1,  .5,   2,   1,   1,   1,   1,   1,   2,   1,   1,   1,   2,   1],
    fighting: [  1,   1,   1,   1,   1,   1,   1,   1,   1,   2,   2,  .5,  .5,   1,   1,  .5,   1,   2],
    poison:   [  1,   1,   1,   1,  .5,   1,  .5,  .5,   2,   1,   2,  .5,   1,   1,   1,   1,   1,  .5],
    ground:   [  1,   1,   2,   0,   2,   2,   1,  .5,   1,   1,   1,   1,  .5,   1,   1,   1,   1,   1],
    flying:   [  1,   1,   1,   2,  .5,   2,  .5,   1,   0,   1,   1,  .5,   2,   1,   1,   1,   1,   1],
    psychic:  [  1,   1,   1,   1,   1,   1,  .5,   1,   1,   1,  .5,   2,   1,   2,   1,   2,   1,   1],
    bug:      [  1,   2,   1,   1,  .5,   1,  .5,   1,  .5,   2,   1,   1,   2,   1,   1,   1,   1,   1],
    rock:     [ .5,  .5,   2,   1,   2,   1,   2,  .5,   2,  .5,   1,   1,   1,   1,   1,   1,   2,   1],
    ghost:    [  0,   1,   1,   1,   1,   1,   0,  .5,   1,   1,   1,  .5,   1,   2,   1,   2,   1,   1],
    dragon:   [  1,  .5,  .5,  .5,  .5,   2,   1,   1,   1,   1,   1,   1,   1,   1,   2,   1,   1,   2],
    dark:     [  1,   1,   1,   1,   1,   1,   2,   1,   1,   1,   0,   2,   1,  .5,   1,  .5,   1,   2],
    steel:    [ .5,   2,   1,   1,  .5,  .5,   2,   0,   2,  .5,  .5,  .5,  .5,   1,  .5,   1,  .5,  .5],
    fairy:    [  1,   1,   1,   1,   1,   1,  .5,   2,   1,   1,   1,  .5,   1,   1,   0,  .5,   2,   1]
}

const typeIndices = {
    normal: 0,
    fire: 1,
    water: 2,
    electric: 3,
    grass: 4,
    ice: 5,
    fighting: 6,
    poison: 7,
    ground: 8,
    flying: 9,
    psychic: 10,
    bug: 11,
    rock: 12,
    ghost: 13,
    dragon: 14,
    dark: 15,
    steel: 16,
    fairy: 17
}

export { typeColours, typeChart, typeIndices, typeList };