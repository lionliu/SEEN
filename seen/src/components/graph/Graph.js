import React, { Component } from 'react'
import './Graph.css'
import apis from '../../api/index';

const _ = require('lodash')
const d3 = require('d3');
const rawData = require('./data.json');
const rawData2 = require('./data2.json');

const APUrl = "https://img.icons8.com/dusk/64/000000/cisco-router.png";
const StaUrl = "https://img.icons8.com/ios-filled/100/000000/smartphone.png"

const WIDTH = 1920 * 0.95;
const HEIGHT = 1080 * 0.95;

const colorMapping = {
    "Normal": "green",
    "Blocked": "red",
    "PBlocked": "salmon",
    "Vulnerable": "yellow",
    "Suspect": "dimgray",
    "Cloned": "darkgreen"
}

function toData(data) {
    let links = [];
    let nodes = [];
    let i = 0;
    let aux;

    data.forEach((Ap) => {
        if (Ap.devices != null) {
            nodes.push({
                id: i,
                isAp: true,
                parent: null,
                mac: Ap.mac,
                radius: 17,
                color: 'blue',
                status: 'Normal',
                prevStatus: '',
                underAttack: false,
                img: APUrl
            })
            aux = i;
            i += 1;
            Ap.devices.forEach((assoc) => {
                nodes.push({
                    id: i,
                    isAp: false,
                    parent: aux,
                    mac: assoc.mac,
                    radius: 10,
                    color: 'green',
                    status: 'Normal',
                    prevStatus: '',
                    underAttack: false,
                    img: StaUrl
                })
                links.push({ // Sintaxe utilizada pelo d3 para criar as arestas
                    source: i,
                    target: aux
                })
                i += 1;
            })
        }
    })

    return { nodes, links };
} 

var myTool = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", "0")
    .style("display", "none");


class Graph extends Component {

    state = {
        Aps: [],
        Events: [],
        isFetching: false
    }

    componentDidMount() {
        apis.getAllAps()
        .then(res => {
            // console.log(res.data);
            console.log('primeiro fetch')
            this.setState({ Aps: res.data });
            this.makeGraph();
        })
        // this.fetchAps();
        // this.makeGraph();
        // this.timer = setInterval(() => this.fetchAps(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }
    
    makeGraph() {
        var data = toData(this.state.Aps);
        var nodes = data.nodes;
        var links = data.links;

        var canvas = d3.select(this.refs.canvas)
            .append('svg')
            .attr('width', '80vw')
            .attr('height', '82vh')
            // .attr("viewBox", [-WIDTH / 2, -HEIGHT / 2, WIDTH, HEIGHT])
            // .call(d3.zoom()
            //     .extent([[0, 0], [WIDTH, HEIGHT]])
            //     .scaleExtent([1, 8])
            //     .on("zoom", function () {
            //     link.attr("transform", d3.event.transform)
            //     node.attr("transform", d3.event.transform)
            // }))
            .style('border', '1px solid black')

        var simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(60))
            .force("charge", d3.forceManyBody().strength(-150))
            .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on('tick', ticked);

        var link = d3.select('svg').append('g')
            .attr('class', 'links')
            .selectAll('line')

        var node = d3.select('svg').append('g')
            .attr('class', 'nodes')
            .selectAll('circle')

        updateGraph(this.state.Aps)

        // Função necessaria para inicializar a simulacao
        function ticked() {
            // node.data(nodes)
            // link.data(links)

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })

            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        }

        function updateGraph(Aps) {
            let data = toData(Aps);
            let nodes = data.nodes;
            let links = data.links;
            // console.log(nodes);

            // const old = new Map(node.data().map(d => [d.id, d]));
            // nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
            // links = links.map(d => Object.assign({}, d));

            node = node.data(nodes, d => d.id);
            // Post e delete dos aparelhos estao bugados. No post ele vem como azul e no delete ele sai, mas torna um AP verde.
            node.exit().remove();

            node = node.enter()
                .append('circle')
                .attr('r', d => d.radius)
                .attr('fill', d => d.color)
                .on("mouseover", function (d) {  //Mouse
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .style("cursor", "pointer")
                        .attr("width", 60) //The bar becomes large
                    myTool.transition() // myTool é o body do html selecionado pelo d3
                        .duration(500)
                        .style('opacity', '1')
                        .style('display', 'block');

                    myTool
                        .html(
                            "<div id ='teste' >Mac: " + d.mac + "<br>Status: " + d.status + "</div>"
                        )
                        .style("left", (d3.event.pageX - 90) + "px")
                        .style("top", (d3.event.pageY - 60) + "px")
                })
                .on("mouseout", function (d) {  //Mouse event
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .style("cursor", "normal")
                        .attr("width", 40)
                    myTool
                        .transition()  //Opacity transition when the tooltip disappears
                        .duration(500)
                        .style("opacity", "0")
                        .style("display", "none")  //The tooltip disappears
                })
                .merge(node);



            link = link.data(links);
            link.exit().remove();

            link = link.enter()
            .append('line')
            .attr('stroke-width', 3)
            .style('stroke', 'black')
            .merge(link);

            simulation.nodes(nodes)
                .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(60))
                .force("charge", d3.forceManyBody().strength(-150))
                .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
                // .force("x", d3.forceX())
                // .force("y", d3.forceY())
                // .on('tick', ticked);
            
            simulation.alpha(1).restart();


        }

        var fetchAps = setInterval(() => {
            this.setState({ ...this.state, isFetching: true });
            apis.getAllAps()
                .then(res => {

                    this.setState({ ...this.state, isFetching: false, })
                    console.log('Print do fetch Aps')
                    let newData = res.data
                    if (!_.isEqual(newData, this.state.Aps)) {
                        this.setState({ Aps: res.data })
                        // console.log(this.state.Aps);
                        console.log('State')
                        console.log(this.state.Aps);
                        updateGraph(this.state.Aps)
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ ...this.state, isFetching: false });
                });
        }, 5000)

        var fetchEvents = setInterval(() => {
            this.setState({ ...this.state, isFetching: true });
            apis.getAllEvents()
                .then(res => {

                    this.setState({ ...this.state, isFetching: false, })
                    console.log('Print do fetch Events')

                    let newData = res.data
                    if (!_.isEqual(newData, this.state.Events)) {
                        this.setState({ Events: res.data })
                        console.log(this.state.Events);
                        updateNode(this.state.Events);
                    }
                })
                .catch(e => {
                    console.log(e);
                    this.setState({ ...this.state, isFetching: false });
                });
        }, 3000)

        // Consegui dar o match, agora so falta alterar a cor dos nodes.
        function updateNode(Events) {
            Events.forEach(event => {
                node.filter(d => d.mac === event.targetAddrMac)
                .attr('fill', d => colorMapping[event.eventType]);
            })
        }

        // var alertAttack = setInterval(() => {
        //     /*Essa função serve pra mudar a cor do nó
        //     e atualizar o seu status quando ele estiver sendo atacado*/
        //     console.log('Fetching data');

        //     fetch('/attacks')
        //         .then(res => res.json())
                // .then(data => {
                //     if (data.length > 0) {
                //         console.log(data[0].dstAddrMAC)
                //         data.forEach(dt => {
                //             nodes.forEach((d) => {
                //                 if (d.mac === dt.dstAddrMAC) {
                //                     console.log('Detectei nó sendo atacado.');
                //                     d.color = 'yellow';
                //                     d.status = 'Unhealthy';
                //                     d.underAttack = true;
                //                 }
                //             })
                //         })
                //     }
                //     nodes.forEach((d) => {
                //         if (!d.isAp) {
                //             if (!d.underAttack) {
                //                 d.color = 'green';
                //                 d.status = 'healthy';
                //             }
                //             if (d.underAttack) {
                //                 d.underAttack = false;
                //             }
                //         }
                //     })
                //     node.data(nodes)
                //         .attr('fill', (d) => { return d.color })
                // })
        //         .catch((err) => {
        //             console.log('Error fetching data');
        //             console.log(err);
        //         })
        // }, 2000);

        /*var testFlag = false
        setInterval(()=>{
            //Atualizar os atributos muda eles lá na páginas
            testFlag = !testFlag
            node.data(nodes)
            node.attr('fill', (d)=>{
                if(d.mac === 'ff:ff:ff:ff:ff:ff'){
                    if(testFlag === true){
                        d.status = 'Unhealthy'
                        return 'yellow'
                    }else{
                        d.status = 'Healthy'
                        return 'green'
                    }
                }else{
                    return d.color
                }
            })
            console.log('Done!');
        },3000)*/
    }

    render() {
        return (
            <div className='graphCanvas'>
                <div ref='canvas'></div>
            </div>
        )
    }
}

export default Graph