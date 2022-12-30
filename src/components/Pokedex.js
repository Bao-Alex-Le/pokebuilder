import React, { useState } from 'react';
import $ from 'jquery';
import Pokemon from './Pokemon';
import pokedex from './utils/pokedex.json';
import pokedexList from './utils/pokedexList.js';
import { typeColours } from './utils/typeData';
import './styles/Pokedex.css';

/**
 * Contains full list of pokedex for user to choose from to add to party
 * displays a list of every pokemon w/ sprites, types, names
 */

class Pokedex extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sorting: {
                search: '',
                sort: 'id asc',
                filters: {
                    /* Generations */ '1': true, '2': true, '3': true, '4': true, '5': true, '6': true, '7': true, '8': true, '9': true,
                    /*    Types    */ 'Normal': true, 'Fire': true, 'Water': true, 'Electric': true, 'Grass': true, 'Ice': true, 'Fighting': true, 'Poison': true, 'Ground': true, 'Flying': true, 'Psychic': true, 'Bug': true, 'Rock': true, 'Ghost': true, 'Dragon': true, 'Dark': true, 'Steel': true, 'Fairy': true
                }
            },
            sbh: 0 // Search.Bar.Height to calculate height of pokedex
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSortChange = this.handleSortChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
        this.handleClearAllClick = this.handleClearAllClick.bind(this);
        this.handleSbhUpdate = this.handleSbhUpdate.bind(this);
    }

    componentDidMount() {
        let sbh = $('.search-bar').height() + 10;
        this.setState({sbh: sbh});
    }

    componentDidUpdate() {
        let sbh = $('.search-bar').height() + 10;
        if (this.state.sbh != sbh) this.setState({sbh: sbh});
    }

    handleSearchChange(query) {
        const newSorting = this.state.sorting;
        newSorting.search = query.toLowerCase();
        this.setState({ sorting: newSorting });
    }

    handleSortChange(sortType) {
        const newSorting = this.state.sorting;
        newSorting.sort = sortType;
        this.setState({ sorting: newSorting });
    }

    handleFilterChange(value, toggle) {
        const newFilter = this.state.sorting;
        newFilter.filters[value] = toggle;
        this.setState({ filters: newFilter });
    }

    handleSelectAllClick() {
        const newFilter = this.state.sorting;
        newFilter.filters = {
            /* Generations */ '1': true, '2': true, '3': true, '4': true, '5': true, '6': true, '7': true, '8': true, '9': true,
            /*    Types    */ 'Normal': true, 'Fire': true, 'Water': true, 'Electric': true, 'Grass': true, 'Ice': true, 'Fighting': true, 'Poison': true, 'Ground': true, 'Flying': true, 'Psychic': true, 'Bug': true, 'Rock': true, 'Ghost': true, 'Dragon': true, 'Dark': true, 'Steel': true, 'Fairy': true
        };
        this.setState({ filters: newFilter });
    }

    handleClearAllClick() {
        const newFilter = this.state.sorting;
        newFilter.filters = {
            /* Generations */ '1': false, '2': false, '3': false, '4': false, '5': false, '6': false, '7': false, '8': false, '9': false,
            /*    Types    */ 'Normal': false, 'Fire': false, 'Water': false, 'Electric': false, 'Grass': false, 'Ice': false, 'Fighting': false, 'Poison': false, 'Ground': false, 'Flying': false, 'Psychic': false, 'Bug': false, 'Rock': false, 'Ghost': false, 'Dragon': false, 'Dark': false, 'Steel': false, 'Fairy': false
        };
        this.setState({ filters: newFilter });
    }

    handleSbhUpdate() {
        let sbh = $('.search-bar').height() + 10;
        this.setState({sbh: sbh});
    }

    render() {
        let searchedDex = pokedexList.filter(pokemon => {
            if (pokemon['name'].toLowerCase().search(this.state.sorting.search) >= 0) {
                return true;
            }
            return false;
        });

        let filteredDex = filterPokedex(searchedDex, this.state.sorting.filters);
        let sortedDex = sortPokedex(filteredDex, this.state.sorting.sort);

        let categoryID = 1;
        const pokemonList = sortedDex.map((category) => {
            const categoryList = category.list.map((pokemon) => {
                const pokemonData = pokedex[pokemon];
                const name        = pokemonData['name'];
                const id          = pokemonData['id'];
                const icon        = pokemonData['icon'];
                const type1       = pokemonData['type1'];
                const type2       = pokemonData['type2'];
                const type1Colour = typeColours[type1.toLowerCase()][0];
                const type2Colour = type2 ? typeColours[type2.toLowerCase()][0] : '';

                const visible = Boolean(!Object.values(this.props.party).find(slot => slot.name == pokemon));
                
                return (
                    <Pokemon 
                        key={id} 
                        pokemon={pokemon}
                        name={name}
                        icon={icon}
                        type1={type1}
                        type2={type2}
                        type1Colour={type1Colour}
                        type2Colour={type2Colour}
                        onPokemonClick={this.props.onPokemonClick}
                        visible={visible}
                    />
                )
            });

            const id = categoryID;
            categoryID += 1;
            return (
                <div key={id}>
                    { 
                        // categories that have no pokemon will not have a header
                        (category.list.length && category.title) ? <h2 className='cat-title'>{category.title}</h2> : null 
                    }
                    {
                        (category.list.length) ? <div className='pokedex-cat'>{categoryList}</div> : null
                    }
                </div>
            );
        });

        const dexStyle = {
            'backgroundColor': '#141c16',
            'boxSizing': 'borderBox',
            'width': '100%',
            'overflowY': 'scroll',
            'overFlowX': 'hidden',
            'height': window.innerHeight - this.state.sbh
        }

        return (
            <div className={`pokedex-container ${this.props.visibility}`}>
                <SearchBar 
                    filterState={this.state.sorting.filters}
                    onSearchChange={this.handleSearchChange} 
                    onSortChange={this.handleSortChange} 
                    onFilterChange={this.handleFilterChange} 
                    onSelectAllClick={this.handleSelectAllClick}
                    onClearAllClick={this.handleClearAllClick}
                    onSbhUpdate={this.handleSbhUpdate}
                />
                <div className="pokedex" style={dexStyle}>
                    {pokemonList}
                </div>
            </div>
        );
    }
}

function SearchBar(props) {
    const [filterMenu, setFilterMenu] = useState(false);

    function handleSearchChange(e) {
        props.onSearchChange(e.target.value);
    }
    
    function handleSortChange(e) {
        props.onSortChange(e.target.value);
    }

    function handleShowFilter(e) {
        setFilterMenu(!filterMenu);
        props.onSbhUpdate();
    }

    let keyVal = 1;

    // generating list of <FilterButton/> components to filter by pokemon generation
    // genFilterInfo contains data for button in form [filtervalue, label]
    const genFilterInfo = [['1', 'I'], ['2', 'II'], ['3', 'III'], ['4', 'IV'], ['5', 'V'], ['6', 'VI'], ['7', 'VII'], ['8', 'VIII'], ['9', 'IX']];
    const genFilterList = genFilterInfo.map(genInfo => {
        const key = keyVal;
        keyVal += 1;

        return (
                <FilterButton 
                    key={key}
                    filter='gen' 
                    color='grey' 
                    filterValue={genInfo[0]} 
                    onFilterChange={props.onFilterChange}
                    isChecked={props.filterState[genInfo[0]]}
                    label={genInfo[1]}
                />
        )
    });
    keyVal = 1;
    // generating list of <FilterButton/> components to filter by pokemon type
    // genFilterInfo contains data for button in form [type]
    const typeFilterInfo = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
    const typeFilterList = typeFilterInfo.map(typeInfo => {
        const key = keyVal;
        keyVal += 1;

        return (
            <FilterButton
                key={key}
                filter='type'
                onFilterChange={props.onFilterChange}
                isChecked={props.filterState[typeInfo]}
                filterValue={typeInfo}
            />
        );
    });

    return (
        <div className='search-bar'>
            <div className='search-options'>
                <div className='search'>
                    <div className='search-label'>Search</div>
                    <input onChange={handleSearchChange}></input>
                </div>
                <div className='sort'>
                    <div className='search-label'>Sort</div>
                    <select onChange={handleSortChange}>
                        <option value="id asc">Dex # (asc.)</option>
                        <option value="id desc">Dex # (desc.)</option>
                        <option value="gen asc">Gen (asc.)</option>
                        <option value="gen desc">Gen (desc.)</option>
                        <option value="type asc">Type</option>
                        <option value="name asc">A-Z</option>
                        <option value="name desc">Z-A</option>
                    </select>
                </div>
                <div className='filter search-label' onClick={handleShowFilter}>
                    <div>Filter</div>
                </div>
            </div>
            {
                filterMenu &&
                <div className='filter-menu'>
                    <div>
                        <h4>Generation</h4>
                        <div className='gen-filters'>
                            {genFilterList}
                        </div>
                    </div>
                    <div>
                        <h4>Type</h4>
                        <div className='type-filters'>
                            {typeFilterList}
                        </div>
                    </div>
                    <div className='filter-options'>
                        <div onClick={props.onSelectAllClick}>Select All</div>
                        <div onClick={props.onClearAllClick}>Clear All</div>
                        <div onClick={handleShowFilter}>Close</div>
                    </div>
                </div>
            }
        </div>
    );
}

function FilterButton(props) {
    const [checked, setChecked] = useState(props.isChecked);

    function handleFilterChange(e) {
        setChecked(!checked);
        props.onFilterChange(e.target.name, e.target.checked);
    }

    const color = props.color ? props.color : typeColours[props.filterValue.toLowerCase()][0];
    const label = props.label ? props.label : props.filterValue;

    const style = {
        'color': 'mintcream',
        'border': `2px solid ${color}`,
        'backgroundColor': color,
        'padding': '2px 12px',
        'margin': '3px 20px 3px 5px',
        'borderRadius': '10px',
        'fontWeight': 'bold',
        'WebkitTextStrokeWidth': '0.5px',
        'WebkitTextStrokeColor': 'black'
    }

    return (
        <div className='filter-button'>
            <input type='checkbox' id={props.filterValue} name={props.filterValue} onChange={handleFilterChange} checked={props.isChecked}></input>
            <label htmlFor={props.filterValue}><div style={style}>{label}</div></label>
        </div>
    );
}

const filterPokedex = (pokedex, filters) => {
    const categories = [['generation'], ['type1', 'type2']];
    pokedex = pokedex.filter(pokemon => {
        return categories.every(category => {
            return category.every(value => {
                return pokemon[value] ? filters[pokemon[value]] : true;
            });
        });
    });
    
    return pokedex;
}

const sortPokedex = (pokedex, sort) => {
    const category = sort.split(' ')[0];
    const order = sort.split(' ')[1];

    const sortedDex = sortCategories[category].sortDex(pokedex, order);
    return sortedDex;
}

const sortCategories = {
    // title: category title, value: corresponding value in pokedex list
    'gen': {
        sortBy: ['generation'],
        categories: [
            {title: 'Generation I',    value:1},
            {title: 'Generation II',   value:2},
            {title: 'Generation III',  value:3},
            {title: 'Generation IV',   value:4},
            {title: 'Generation V',    value:5},
            {title: 'Generation VI',   value:6},
            {title: 'Generation VII',  value:7},
            {title: 'Generation VIII', value:8},
            {title: 'Generation IX', value:9}
        ],
        sortDex: function(dex, order) {
            let categories = [...this.categories];

            let sortedDex = {};
            categories.forEach((category) => {
                sortedDex[category.value] = { title: category.title, list: [] };
            });

            dex.forEach((pokemon) => {
                const generation = pokemon['generation'];
                sortedDex[generation].list.push(pokemon['fname']);
            });

            let sortedDexValues = Object.values(sortedDex);
            if (order === 'desc') {
                sortedDexValues.reverse();
            }

            return sortedDexValues;
        }
    },
    'name': {
        sortBy: ['name'],
        categories: [
            {title: 'A', value: 'A'},
            {title: 'B', value: 'B'},
            {title: 'C', value: 'C'},
            {title: 'D', value: 'D'},
            {title: 'E', value: 'E'},
            {title: 'F', value: 'F'},
            {title: 'G', value: 'G'},
            {title: 'H', value: 'H'},
            {title: 'I', value: 'I'},
            {title: 'J', value: 'J'},
            {title: 'K', value: 'K'},
            {title: 'L', value: 'L'},
            {title: 'M', value: 'M'},
            {title: 'N', value: 'N'},
            {title: 'O', value: 'O'},
            {title: 'P', value: 'P'},
            {title: 'Q', value: 'Q'},
            {title: 'R', value: 'R'},
            {title: 'S', value: 'S'},
            {title: 'T', value: 'T'},
            {title: 'U', value: 'U'},
            {title: 'V', value: 'V'},
            {title: 'W', value: 'W'},
            {title: 'X', value: 'X'},
            {title: 'Y', value: 'Y'},
            {title: 'Z', value: 'Z'}
        ],
        sortDex: function(dex, order) {
            let categories = [...this.categories];

            let sortedDex = {};
            categories.forEach((category) => {
                sortedDex[category.value] = { title: category.title, list: [] };
            });

            dex.forEach((pokemon) => {
                const name = pokemon['name'];
                const firstLetter = name[0].toUpperCase();
                sortedDex[firstLetter].list.push(pokemon['fname']);
                sortedDex[firstLetter].list.sort((a, b) => {
                    if (a <= b) {
                        return -1;
                    }
                    return 1;
                });
            });

            let sortedDexValues = Object.values(sortedDex);
            if (order === 'desc') {
                sortedDexValues.reverse();
                sortedDexValues.forEach(category => {
                    category.list.reverse();
                });
            }

            return sortedDexValues;
        }
    },
    'type': {
        sortBy: ['type1', 'type2'],
        categories: [
            {title: 'Normal',   value: 'Normal'},
            {title: 'Fire',     value: 'Fire'},
            {title: 'Water',    value: 'Water'},
            {title: 'Grass',    value: 'Grass'},
            {title: 'Electric', value: 'Electric'},
            {title: 'Ice',      value: 'Ice'},
            {title: 'Fighting', value: 'Fighting'},
            {title: 'Poison',   value: 'Poison'},
            {title: 'Ground',   value: 'Ground'},
            {title: 'Flying',   value: 'Flying'},
            {title: 'Psychic',  value: 'Psychic'},
            {title: 'Bug',      value: 'Bug'},
            {title: 'Rock',     value: 'Rock'},
            {title: 'Ghost',    value: 'Ghost'},
            {title: 'Dragon',   value: 'Dragon'},
            {title: 'Dark',     value: 'Dark'},
            {title: 'Steel',    value: 'Steel'},
            {title: 'Fairy',    value: 'Fairy'}
        ],
        sortDex: function(dex, order) {
            let categories = [...this.categories];

            let sortedDex = {};
            categories.forEach((category) => {
                sortedDex[category.value] = { title: category.title, list: [] };
            });

            dex.forEach((pokemon) => {
                const type1 = pokemon['type1'];
                const type2 = pokemon['type2'];
                sortedDex[type1].list.push(pokemon['name']);
                if (type2) sortedDex[type2].list.push(pokemon['fname']);
            });

            let sortedDexValues = Object.values(sortedDex);
            if (order === 'desc') {
                sortedDexValues.reverse();
                sortedDexValues.forEach(category => {
                    category.list.reverse();
                });
            }

            return sortedDexValues;
        }
    },
    'id' : {
        sortBy: ['id'],
        sortDex: function(dex, order) {
            const sortedDex = [{ title: null, list: [] }];
            dex.forEach(pokemon => {
                sortedDex[0].list.push(pokemon['fname']);
            });
            if (order === 'desc') sortedDex[0].list.reverse();
            return sortedDex;
        }
    }
}

export default Pokedex;