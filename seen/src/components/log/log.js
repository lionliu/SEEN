import React, { Component } from 'react'
import apis from '../../api/index';
import './log.css';

// const fs = require('fs');

function newLog(level, msg) {
    return {
        level: level,
        msg: msg,
        timestamp: new Date()
    }
}

// O log so esta sendo feito na parte do front-end.
// Porem ele nao esta salvando pois roda no browser.
// Uma alternativa é realizar o log no back-end e dar um fetch nesta pagina.


export default class log extends Component {

    state = {
        logs: [],
        Aps: [],
        isFetching: false,
    };

    componentDidMount() {
        this.fetchAps();
        this.timer = setInterval(() => this.fetchAps(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }

    fetchAps() {
        this.setState({ ...this.state, isFetching: true });
        apis.getAllAps()
            .then(res => {
                // Verificar se o len se alterou para adicionar no log;
                let newAps = res.data;

                if (this.state.Aps.length > 0) {
                    // Novo AP ou AP removido
                    if (newAps.length > this.state.Aps.length) {
                        let log = newLog('info', 'New AP added');
                        this.setState(prevState => ({
                            logs: [...prevState.logs, log]
                        }))
                    } else if (newAps.length < this.state.Aps.length) {
                        let log = newLog('info', 'AP removed');
                        this.setState(prevState => ({
                            logs: [...prevState.logs, log]
                        }))
                    }
                }

                for(let i = 0; i < this.state.Aps.length && i < newAps.length; i++) {
                    // console.log('Checking AP ' + i);
                    // console.log(this.state.Aps[i].devices.length);
                    // console.log(newAps[i].devices.length);
                    let j = 0;
                    // Procurar o AP com o mac equivalente;
                    while(this.state.Aps[i].mac !== newAps[j].mac) {
                        j++;
                    }
                    if(this.state.Aps[i].devices.length < newAps[j].devices.length) {
                        let log = newLog('info', 'New device added');
                        this.setState(prevState => ({
                            logs: [...prevState.logs, log]
                        }))
                    } else if (this.state.Aps[i].devices.length > newAps[j].devices.length) {
                        let log = newLog('info', 'Device removed');
                        this.setState(prevState => ({
                            logs: [...prevState.logs, log]
                        }))
                    }
                }

                this.setState({ Aps: res.data, isFetching: false });

            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, isFetching: false });
            });
    }

    // Não funciona pois esta sendo realizado no browser;
    // saveLog() {
    //     if(this.state.logs.length > 0) {
    //         let logCopy = this.state.logs;
    //         let timestamp = logCopy[0].timestamp;
    //         let day = timestamp.getDate();
    //         let month = timestamp.getMonth() + 1;
    //         let hour = timestamp.getHours();
    //         let min = timestamp.getMinutes();
    //         let filename = '' + day + '_' + month + '_' + hour + ":" + min + '.log';
    //         fs.writeFile(filename, logCopy, 'utf8', function (err) {
    //             if (err) {
    //                 console.log("An error occured while writing log to File.");
    //                 return console.log(err);
    //             }

    //             console.log("log file has been saved.");
    //         });
    //     }
        
    // }



    render() {
        // console.log(this.state.Aps);
        const listAps = this.state.logs.slice().reverse().map(log => (
            <p key={log.timestamp.toString()}>{log.msg} : {log.timestamp.toString()}</p>
        ))

        return (
            <div className="generalBox">

                <div className="pageTitle">
                    Logs
                </div>
                {/* <button onClick={this.saveLog()}>
                    Save log file
                </button> */}
                {listAps}

            </div>
        )
    }
}
