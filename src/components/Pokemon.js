import React from 'react';
import './styles/Pokemon.css';
import pokemonIcon from '../img/pokemonicons.png';

/**
 *  Individual card for pokemon in pokedex
 *  displays pokemon sprite with name and type data
 */

class Pokemon extends React.Component {
    constructor(props) {
        super(props);

        // Calculating top-left coordinates for icon in spritesheet
        const dex = this.props.icon;
        const top = Math.floor(dex / 12) * 30;
        const left = (dex % 12) * 40;

        // css styling for pokemon card border, colour changes based on pokemon typings
        const backgroundStyle = this.props.type2Colour ? `linear-gradient(180deg, ${this.props.type1Colour} 42%, ${this.props.type2Colour} 58%)` 
                                                       : this.props.type1Colour;

        this.borderDisplay = 'inline-flex';

        this.borderStyle = {
            "display": this.borderDisplay,
            "justifyContent": "center",
            "alignItems": "center",
            "boxSizing": "border-box",
            "background": backgroundStyle,
            "width": "100%",
            "height": "100%",
            "borderRadius": "15px",
            "padding": "5px"
        }

        // css styling for icon using css sprites
        this.imgStyle = {
            width: '40px',
            height: '30px',
            margin: '0 auto 3px',
            display: 'block',
            background: 'url(' + pokemonIcon + ')',
            backgroundPosition: `-${left}px -${top}px`,
            cursor: 'pointer'
        };

        this.handlePokemonSelect = this.handlePokemonSelect.bind(this);
    }

    handlePokemonSelect(e) {
        this.props.onPokemonClick(this.props.pokemon);
    }

    render() {
        let pokemon;
        if (this.props.visible) {
            pokemon = (
                <div className='pokemonBorder' style={this.borderStyle}>
                    <div className={`${this.props.pokemon} pokemon`} onClick={this.handlePokemonSelect}>
                        <span className='pkmnSprite' style={this.imgStyle}></span>
                        <span className='types'>
                            { this.props.type1
                                ? <img src={ require(`../img/types/${this.props.type1}.png`) }/>
                                : null
                            }
                            { this.props.type2
                                ? <img src={ require(`../img/types/${this.props.type2}.png`) }/>
                                : null
                            }
                        </span>
                        <div className='pkmn-label'>
                            <p>{this.props.name}</p>
                        </div>
                    </div>
                </div>
            );
        } else {
            pokemon = null;
        }

        return pokemon;
    }
}

export default Pokemon;