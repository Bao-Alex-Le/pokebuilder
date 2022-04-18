import React from 'react';
import './styles/Pokemon.css';
import backgroundImg from '../img/pokemonicons-sheet.png';

/**
 * Individual icon card for specific pokemon
 * displays sprite for pokemon with name and type data
 */

class Pokemon extends React.Component {
    constructor(props) {
        super(props);

        // Calculating top-left coordinates for icon in spritesheet
        const dex = this.props.icon;
        const top = Math.floor(dex / 12) * 30;
        const left = (dex % 12) * 40;

        // css styling for icon using css sprites
        this.imgStyle = {
            width: '40px',
            height: '30px',
            display: 'inline-block',
            background: 'url(' + backgroundImg + ')',
            backgroundPosition: `-${left}px -${top}px`
        };
        
    }

    render() {
        return (
            <div className={this.props.pokemon}>
                <span style={this.imgStyle}></span>
            </div>
        );
    }
}

export default Pokemon;