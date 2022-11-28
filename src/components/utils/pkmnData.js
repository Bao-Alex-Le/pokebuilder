import React from 'react';
import pokedex from './pokedex.json';
import pokemonIcon from '../../img/pokemonicons.png';

const getPkmnSprite = (pokemon) => {
    const icon = pokemon ? pokedex[pokemon]['icon'] : 0;
    const top = Math.floor(icon / 12) * 30;
    const left = (icon % 12) * 40;
        
    const imgStyle = {
        width: '40px',
        height: '30px',
        margin: '0',
        display: 'block',
        background: 'url(' + pokemonIcon + ')',
        backgroundPosition: `-${left}px -${top}px`
    };

    return (<span style={imgStyle}></span>);
}

export { getPkmnSprite };