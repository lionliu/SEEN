        // var simulation = d3.forceSimulation(nodes) // Inicializa a simulação com o array de nodes
        //     .force('charge', d3.forceManyBody().strength(-200)) // Faz com que os nós fiquem espaçados igualmente. O número negativo indica uma força de repulsao entre os nós.
        //     .force('center', d3.forceCenter(width / 2, height / 2)) // Indica a posição do centro
        //     // .force('collision', d3.forceCollide().radius(function(d){return d.radius}))
        //     .force('link', d3.forceLink().links(links).distance(70)) // Indica o array de arestas e o tamanho delas
        //     // .force('link', d3.forceLink().links(links).distance(links.length * 3))
        //     .on('tick', ticked) // Faz com que a simulacao rode



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