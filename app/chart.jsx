import { h, stream, merge$, ADDED} from 'zliq';
import {getSize} from './utils.js';
var Chart = require('chart.js');

export const MilestoneChart = ({from, until, events$}) => {
    let _from = new Date(from.setHours(12,0,0,0))
    let _until = new Date(until.setHours(12,0,0,0))
    let canvas = <canvas id="myChart" width="400" height="400"></canvas>;
    canvas.addEventListener(ADDED, ()=> {
        var myChart = new Chart(canvas, {
            type: 'line',
            data: {
                datasets: [{
                    label: '# of Open Issues',
                    borderColor: 'rgba(255, 51, 0, 0.4)',
                    backgroundColor: 'rgba(255, 51, 0, 1)',
                    fill: false
                }, {
                    label: 'Ideal burndown',
                    lineTension: 0,
                    fill: false,
                    pointRadius: 0,
                    hoverRadius: 0
                }]
            },
            options: {
                responsive:true,
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        type: 'time',
                        time: {
                            unit: 'day',
                            isoWeekday: true,
                            displayFormats: {
                                week: 'll'
                            },
                            min: _from,
                            max: _until
                        },
                        // ticks: {
                        //     maxTicksLimit: 10
                        // }
                    }]
                }
            }
        });
        events$.map(events => {
            let issueCount = events.filter(event => event.event === 'milestoned')
                .reduce((sum, cur)=> sum + getSize(cur.issue), 0);
            issueCount -= events.filter(event => event.event === 'demilestoned')
                .reduce((sum, cur)=> sum + getSize(cur.issue), 0);
            myChart.data.datasets[0].data = getPoints(events, issueCount, from);
            myChart.data.datasets[1].data = getIdealLine(_from, _until, issueCount);
            myChart.update();
        });
    });
    return canvas;
}

function isWeekend(date) {
    var day = date.getDay();
    return (day == 6) || (day == 0);
}

function getIdealLine(from, until, issueCount) {
    let dates = getDates(from, until);
    let workingDays = dates.reduce((sum, date) => sum + !isWeekend(date), 0);
    let issuesPerDay = issueCount / workingDays;
    return dates.reduce(({points, progress}, date) => {
        if (points.length === 0) {
            return {
                progress,
                points: points.concat({x: date, y: issueCount})
            }
        }
        if (isWeekend(date)) {
            return {
                progress,
                points: points.concat({x: date, y: issueCount - progress})
            }
        }
        return {
            progress: progress + issuesPerDay,
            points: points.concat({x: date, y: issueCount - progress - issuesPerDay})
        }
    }, {
        progress: 0,
        points: []
    }).points;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = new Date(startDate);
    while (currentDate <= stopDate) {
        dateArray.push( new Date (currentDate) )
        currentDate.setDate(currentDate.getDate()+1);
    }
    return dateArray;
}

function getPoints(events, issueCount, startDate) {
    return events.reduce((points,event) => {
        let newCount = issueCount;
        if (event.event === 'closed') {
            newCount -= getSize(event.issue);
        } else if (event.event === 'reopened') {
            newCount += getSize(event.issue);
        } else {
            return points;
        }
        return points.concat({
            y: newCount,
            x: event.createdAt
        });
    }, [{
        x: startDate,
        y: issueCount
    }]);
}