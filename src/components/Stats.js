import React from 'react';
import './styles/Stats.css';

class Stats extends React.Component {
    constructor(props) {
        super(props);

        this.statDict = {
            'hp': {
                'short': 'HP',
                'average': 70,
                'median': 67,
                'highest': 255
            },
            'attack': {
                'short': 'Atk',
                'average': 80,
                'median': 76,
                'highest': 190
            },
            'defense': {
                'short': 'Def',
                'average': 75,
                'median': 70,
                'highest': 250
            },
            'sp_attack': {
                'short': 'SpA.',
                'average': 75,
                'median': 65,
                'highest': 194
            },
            'sp_defense': {
                'short': 'SpD.',
                'average': 75,
                'median': 70,
                'highest': 250
            },
            'speed': {
                'short': 'Spe',
                'average': 70,
                'median': 65,
                'highest': 200
            }
        }
    }

    getBarVal(stat, statVal) {
        const average = this.statDict[stat]['average'];
        const median  = this.statDict[stat]['median'];
        const highest = this.statDict[stat]['highest'];
        statVal < 0 ? statVal=0 : false;
        if (statVal <= average) {
            return Math.round((statVal/average * 50) * 10) / 10;
        } else {
            return Math.round(((statVal-median)/(highest-median) * 50 + 50) * 10) / 10;
        }
    }

    getBarColor(barVal) {
        barVal < 0   ? barVal=0   : false;
        barVal > 100 ? barVal=100 : false;
        if (barVal <= 50) {
            return `rgb(${200}, ${parseInt( 200 * barVal/50 )}, 0)`
        } else {
            return `rgb(${parseInt( 200 * (100-barVal)/50 )}, ${200}, 0)`
        }
    }

    render() {
        const stats = this.props.stats;
        const statList = Object.entries(this.props.stats).map((statData, id) => {
            const stat = statData[0];
            const statValue = parseInt(statData[1]);
            const barVal = this.getBarVal(stat, statValue);
            //const highest = this.statDict[stat]['highest'];
            //const barVal = Math.round(statValue / highest * 100 * 10) / 10;
            const statBarStyle = {
                width: `${barVal}%`,
                height: '50%',
                backgroundColor: this.getBarColor(barVal)
            }

            return (
                <div key={id} className='stat'>
                    <p>{this.statDict[stat]['short']}</p>
                    <div className='stat-bar'>
                        <span style={statBarStyle}></span>
                    </div>
                    <p>{statValue}</p>
                </div>
            );
        });

        return (
            <div className='stat-info'>
                {statList}
            </div>
        );
    }
}

export default Stats;