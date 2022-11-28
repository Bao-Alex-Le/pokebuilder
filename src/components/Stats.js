import React from 'react';
import './styles/Stats.css';

class Stats extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const stats = this.props.stats;
        const statList = Object.entries(this.props.stats).map((statData, id) => {
            const stat = statData[0];
            const statValue = parseInt(statData[1]);
            const barVal = getBarVal(stat, statValue);
            const barCol = getBarColor(barVal);
            const statBarStyle = {
                width: `${barVal}%`,
                height: '50%',
                backgroundColor: barCol
            }

            return (
                <div key={id} className='stat'>
                    <p>{statDict[stat]['short']}</p>
                    <div className='stat-bar'>
                        <span style={statBarStyle}></span>
                    </div>
                    <p>{statValue}</p>
                </div>
            );
        });

        return (
            <div className='stat-info'>
                <div className='stat-title'>Stats</div>
                {statList}
            </div>
        );
    }
}

export function getBarVal(stat, statVal) {
    const average = statDict[stat]['average'];
    const median  = statDict[stat]['median'];
    const highest = statDict[stat]['highest'];
    statVal = statVal < 0 ? 0 : statVal;
    if (statVal <= average) {
        return Math.round((statVal/average * 50) * 10) / 10;
    } else {
        return Math.round(((statVal-median)/(highest-median) * 50 + 50) * 10) / 10;
    }
}

export function getBarColor(barVal) {
    barVal = barVal < 0   ? 0   : barVal;
    barVal = barVal > 100 ? 100 : barVal;
    if (barVal <= 50) {
        return `rgb(${200}, ${parseInt( 200 * barVal/50 )}, 0)`;
    } else {
        return `rgb(${parseInt( 200 * (100-barVal)/50 )}, ${200}, 0)`;
    }
}

export const statDict = {
    'hp': {
        'full': 'HP',
        'short': 'HP',
        'average': 70,
        'median': 67,
        'highest': 255
    },
    'attack': {
        'full': 'Attack',
        'short': 'Atk',
        'average': 80,
        'median': 76,
        'highest': 190
    },
    'defense': {
        'full': 'Defense',
        'short': 'Def',
        'average': 75,
        'median': 70,
        'highest': 250
    },
    'sp_attack': {
        'full': 'Special Attack',
        'short': 'SpA.',
        'average': 75,
        'median': 65,
        'highest': 194
    },
    'sp_defense': {
        'full': 'Special Defense',
        'short': 'SpD.',
        'average': 75,
        'median': 70,
        'highest': 250
    },
    'speed': {
        'full': 'Speed',
        'short': 'Spe',
        'average': 70,
        'median': 65,
        'highest': 200
    }
}

export default Stats;