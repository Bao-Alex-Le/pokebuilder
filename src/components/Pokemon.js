import React from 'react';
import './styles/Pokemon.css';
import backgroundImg from '../img/pokemonicons.png';

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

        // css styling for pokemon card border, colour changes based on pokemon typings
        const backgroundStyle = this.props.type2Colour ? `linear-gradient(180deg, ${this.props.type1Colour} 42%, ${this.props.type2Colour} 58%)` 
                                                       : this.props.type1Colour;

        this.borderDisplay = 'inline-flex';

        this.borderStyle = {
            "display": this.borderDisplay,
            "justifyContent": "center",
            "alignItems": "center",
            "background": backgroundStyle,
            "width": "auto",
            "height": "auto",
            "margin": "3px",
            "borderRadius": "15px",
            "padding": "2px"
        }

        // css styling for icon using css sprites
        this.imgStyle = {
            width: '40px',
            height: '30px',
            margin: '0 auto 3px',
            display: 'block',
            background: 'url(' + backgroundImg + ')',
            backgroundPosition: `-${left}px -${top}px`,
            cursor: 'pointer'
        };

        this.handlePokemonSelect = this.handlePokemonSelect.bind(this);
    }

    handlePokemonSelect(e) {
        this.props.onPokemonClick(this.props.pokemon);
    }

    render() {
        return (
            <div>
            {this.props.visible == true && // if pokemon is already in party, component will not render
                <div className='pokemonBorder' style={this.borderStyle}>
                    <div className={`${this.props.pokemon} pokemon`} onClick={this.handlePokemonSelect}>
                        <span className='sprite' style={this.imgStyle}></span>
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
                            <p>{this.props.pokemon}</p>
                        </div>
                    </div>
                </div>
            }
            </div>
        );
    }
}

export default Pokemon;