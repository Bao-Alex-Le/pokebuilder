import React from 'react';
import './styles/Moves.css';

class Moves extends React.Component {
    constructor(props) {
        super(props);

        this.handleMoveClick = this.handleMoveClick.bind(this);
    }

    handleMoveClick(e) {
        const pokemon = this.props.pokemon;
        const slot = this.props.slot;
        const moveSlot = e.target.className.split(' ')[2];
        this.props.onMoveClick(pokemon, slot, moveSlot);
    }

    render() {
        return (
            <div className='pkmn-moves'>
                <div className='move-title'>Moves</div>
                <div className='top row'>
                    <div className='move slot 1' onClick={this.handleMoveClick}>
                        <div>{this.props.moves['1']}</div>
                    </div>
                    <div className='move slot 2' onClick={this.handleMoveClick}>
                        <div>{this.props.moves['2']}</div>
                    </div>
                </div>
                <div className='bottom row'>
                    <div className='move slot 3' onClick={this.handleMoveClick}>
                        <div>{this.props.moves['3']}</div>
                    </div>
                    <div className='move slot 4' onClick={this.handleMoveClick}>
                        <div>{this.props.moves['4']}</div>
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * <div className={`move slot ${props.key}`} onClick={handleMoveClick}>
        <div>{props.move}</div>
        <div className='move-type'>
            <img src={require(`../img/types/${type}.png`)}/>
            <img src={require(`../img/types/${category}.png`)}/>
        </div>
        <div>
            <div>
                <div>Pwr.</div>
                <div>{power}</div>
            </div>
            <div>
                <div>Acc.</div>
                <div>{accuracy}</div>
            </div>
        </div>
    </div>
 */

export default Moves;