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
                radius: 15,
                color: 'blue',
                status: 'Healthy',
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
                    radius: 12,
                    color: 'green',
                    status: 'Healthy',
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
        isFetching: false
    }

    // fetchAps method to fetch Access Points from Mongo.
    fetchAps() {
        this.setState({ ...this.state, isFetching: true });
        apis.getAllAps()
            .then(res => {

                this.setState({ ...this.state, isFetching: false, })
                // // console.log(this.state.Aps)
                // if(this.state.firstFetch) {
                //     this.setState({ ...this.state, firstFetch: false })
                //     this.makeGraph()
                // }
                let newData = res.data
                if(!_.isEqual(newData, this.state.Aps)) {
                    this.setState({ Aps: res.data })
                    this.makeGraph()
                }
            })
            .catch(e => {
                console.log(e);
                this.setState({ ...this.state, isFetching: false });
            });
    }

    componentDidMount() {
        // apis.getAllAps()
        // .then(res => {
        //     console.log(res.data);
        //     this.setState({ Aps: res.data });
        //     this.makeGraph();
        // })
        this.fetchAps();
        // this.makeGraph();
        this.timer = setInterval(() => this.fetchAps(), 5000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.timer = null;
    }
    
    // Passar os atributos do makeGraph para fora para que ele possa reinicializar o d3 quando for chamado denovo no fetch
    makeGraph() {
        var data = toData(this.state.Aps);
        var nodes = data.nodes;
        var links = data.links;

        var canvas = d3.select(this.refs.canvas)
            .append('svg')
            .attr('width', '80vw')
            .attr('height', '82vh')
            .call(d3.zoom()
                .extent([[0, 0], [WIDTH, HEIGHT]])
                .scaleExtent([1, 8])
                .on("zoom", function () {
                link.attr("transform", d3.event.transform)
                node.attr("transform", d3.event.transform)
            }))
            .style('border', '1px solid black')

        // var simulation = d3.forceSimulation(nodes) // Inicializa a simulação com o array de nodes
        //     .force('charge', d3.forceManyBody().strength(-200)) // Faz com que os nós fiquem espaçados igualmente. O número negativo indica uma força de repulsao entre os nós.
        //     .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2)) // Indica a posição do centro
        //     // .force('collision', d3.forceCollide().radius(function(d){return d.radius}))
        //     .force('link', d3.forceLink().links(links).distance(70)) // Indica o array de arestas e o tamanho delas
        //     // .force('link', d3.forceLink().links(links).distance(links.length * 3))
        //     .on('tick', ticked) // Faz com que a simulacao rode

        var simulation = d3.forceSimulation(nodes)
            .force("link", d3.forceLink(links).id(d => d.id).links(links).distance(60))
            .force("charge", d3.forceManyBody().strength(-150))
            .force('center', d3.forceCenter(WIDTH / 2, HEIGHT / 2))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on('tick', ticked);

        // Vai gerar as arestas no DOM
        var link = d3.select('svg').append('g')
            .attr('class', 'links')
            .selectAll('line')
            .data(links)
            .enter()
            .append('line')
            .attr('stroke-width', 3)
            .style('stroke', 'black')

        // Gera os nodes no DOM
        var node = d3.select('svg').append('g')
            .attr('class', 'nodes')
            .selectAll('circle')
            .data(nodes)
        
        node.exit().remove()

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
            });

        // var node = d3.select('svg').append('g')
        //     .attr('class', 'nodes')
        //     .selectAll('circle')
            

        

        // Função necessaria para inicializar a simulacao
        function ticked() {
            node.data(nodes)
            link.data(links)

            // With circles
            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })

            // To keep within the borders
            // node.attr("cx", function (d) { return d.x = Math.max(d.radius, Math.min(width - d.radius, d.x)); })
            //     .attr("cy", function (d) { return d.y = Math.max(d.radius, Math.min(height - d.radius, d.y)); });

            // With Images
            // node.attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")"; })

            link.attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });
        }
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