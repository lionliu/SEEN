import React, { Component } from 'react'
import './Graph.css'

const d3 = require('d3');
const rawData = require('./data.json');

class Graph extends Component {
    componentDidMount() {
        d3.selectAll("p").style("color", "blue");
        this.makeGraph();
    }

    toData(data) {
        var links = [];
        var nodes = [];
        var i = 0;
        var aux;

        data.Aps.forEach((device) => {
            if (device.AssocDevices != null) {
                nodes.push({
                    index: i,
                    isAp: true,
                    parent: null,
                    Mac: device.Mac,
                    radius: 15,
                    color: 'blue',
                    status: 'Healthy',
                    underAttack: false

                })
                aux = i;
                i += 1;
                device.AssocDevices.forEach((a) => {
                    nodes.push({
                        index: i,
                        isAp: false,
                        parent: aux,
                        Mac: a.Mac,
                        radius: 12,
                        color: 'green',
                        status: 'Healthy',
                        underAttack: false
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

    makeGraph() {
        var width = 1366 * 0.95, height = 768 * 0.95;
        var data = this.toData(rawData)
        var nodes = data.nodes;
        var links = data.links;
        var centered;

        var myTool = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("opacity", "0")
            .style("display", "none");

        var canvas = d3.select(this.refs.canvas)
            .append('svg')
            .attr('width', '80vw')
            .attr('height', '82vh')
            .call(d3.zoom().on("zoom", function () {
                link.attr("transform", d3.event.transform)
                node.attr("transform", d3.event.transform)
            }))
        //.style('border', '1px solid black')

        var simulation = d3.forceSimulation(nodes) // Inicializa a simulação com o array de nodes
            .force('charge', d3.forceManyBody().strength(-250)) // Faz com que os nós fiquem espaçados igualmente. O número negativo indica uma força de repulsao entre os nós.
            .force('center', d3.forceCenter(width / 2, height / 2)) // Indica a posição do centro
            // .force('collision', d3.forceCollide().radius(function(d){return d.radius}))
            .force('link', d3.forceLink().links(links).distance(70)) // Indica o array de arestas e o tamanho delas
            // .force('link', d3.forceLink().links(links).distance(links.length * 3))
            .on('tick', ticked) // Faz com que a simulacao rode

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
            .enter()
            .append('circle')
            .attr('r', d => d.radius)
            .attr('fill', d => d.color)
            .on("click", function (d) {
                window.location.replace("http://localhost:3000/Alerts?Mac=" + d.Mac);
            })
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
                        "<div id ='teste' >Mac: " + d.Mac + "<br>Status: " + d.status + "</div>"
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

        var alertAttack = setInterval(() => {
            /*Essa função serve pra mudar a cor do nó
            e atualizar o seu status quando ele estiver sendo atacado*/
            console.log('Fetching data');

            fetch('/attacks')
                .then(res => res.json())
                .then(data => {
                    if (data.length > 0) {
                        console.log(data[0].dstAddrMAC)
                        data.forEach(dt => {
                            nodes.forEach((d) => {
                                if (d.Mac === dt.dstAddrMAC) {
                                    console.log('Detectei nó sendo atacado.');
                                    d.color = 'yellow';
                                    d.status = 'Unhealthy';
                                    d.underAttack = true;
                                }
                            })
                        })
                    }
                    nodes.forEach((d) => {
                        if (!d.isAp) {
                            if (!d.underAttack) {
                                d.color = 'green';
                                d.status = 'healthy';
                            }
                            if (d.underAttack) {
                                d.underAttack = false;
                            }
                        }
                    })
                    node.data(nodes)
                        .attr('fill', (d) => { return d.color })
                })
                .catch((err) => {
                    console.log('Error fetching data');
                    console.log(err);
                })
        }, 2000);

        /*function restart() {
            //Reinserir os nós e links
            // Apply the general update pattern to the nodes.
            node = node.data(nodes, function(d) { return d.id;});
            node.exit().remove();
            node = node.enter().append("circle").attr("fill", function(d) { return d.color; }).attr("r", (d)=>{return d.radius}).merge(node);
          
            // Apply the general update pattern to the links.
            link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
            link.exit().remove();
            link = link.enter().append("line").merge(link).attr('stroke-width', 3)
            .style('stroke', 'black');
          
            // Update and restart the simulation.
            simulation.nodes(nodes);
            simulation.force("link").links(links);
            simulation.alpha(1).restart();
        }*/
        /*var testFlag = false
        setInterval(()=>{
            //Atualizar os atributos muda eles lá na páginas
            testFlag = !testFlag
            node.data(nodes)
            node.attr('fill', (d)=>{
                if(d.Mac === 'ff:ff:ff:ff:ff:ff'){
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

        // Função necessaria para inicializar a simulacao
        function ticked() {
            node.data(nodes)
            link.data(links)

            node.attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })


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