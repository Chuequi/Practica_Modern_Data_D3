const ancho = 800
const alto = 600
const margen = {
    superior : 10,
    inferior : 40,
    izquierdo : 60,
    derecho : 40
}
const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)



const svg = d3.select("#chart").append("svg")
    .attr("width", ancho)
    .attr("height", alto)
    .attr("id", "svg")
const grupoElementos = svg.append("g").attr("class", "grupoElementos")
   .attr("transform", `translate(${margen.izquierdo},${margen.superior})`)

// escalas y ejes
var x = d3.scaleBand().range([0, ancho - margen.izquierdo - margen.derecho])
   .padding(0.1)
var y = d3.scaleLinear().range([alto - margen.inferior - margen.superior, 0])
    
// porque las coordenadas van de arriba hacia abajo en svg

const grupoEjes = svg.append("g").attr("id", "grupoEjes")
const grupoX = grupoEjes.append("g").attr("id", "grupoX")
    .attr("transform", `translate(${margen.izquierdo},${alto-margen.inferior})`)
const grupoY = grupoEjes.append("g").attr("id", "grupoY")
    .attr("transform", `translate(${margen.izquierdo},${margen.superior})`)

const ejeX = d3.axisBottom().scale(x)
const ejeY = d3.axisLeft().scale(y) // este es para generar ejes verticales

// var tooltip = grupoElementos.append("g").attr("id", "tooltip")
var tooltip2 = d3.select("#chart")
    .append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .text("TOOLTIP");

var recta = grupoElementos.append("g").attr("id", "edadDicaprio")
var circulos = grupoElementos.append("g").attr("class", "circulos")


//data:


d3.csv("data.csv").then(data => {
    data.map(d => {
        d.year = +d.year
        d.age = +d.age
        
        })
        x.domain(data.map(d=>d.year))
        y.domain([d3.min(data.map(d=>d.age-1)),ageToday])//[min, max]
    
    grupoX.call(ejeX)
    grupoY.call(ejeY)

    //data binding:
    var elementos = grupoElementos.selectAll("rect").data(data)
    
    var myColor = d3.scaleOrdinal().domain(data)
         .range(d3.schemeSet3) //esto lo busqué en internet, para dar
                               //formato de color según la categoría(en este caso
                               //según nombre de chica)
    elementos.enter().append("rect")
            .attr("fill", d => myColor(d.name))
            .attr("class", d => d.name.replace(" ", "-"))
            .attr("width", x.bandwidth())
            .attr("height", d=> alto-margen.superior-margen.inferior-y(d.age))
            .attr("y", d=>y(d.age))
            .attr("x", d => x(d.year))
            
    recta.datum(data).append('path')
            .attr("d", d3.line()
                .x(d => x(d.year)+x.bandwidth()/2)
                .y(d =>y(age(d.year)))
            )
            
    circulos.selectAll("circle")
    .data(data)
    .join("circle")    
        .attr("cx", d => x(d.year)+x.bandwidth()/2)
        .attr("cy", d => y(age(d.year)))
        .attr("r", 5)
        .attr("fill", 'blue')
        .attr("fill-opacity", 0.2)
        
        .on("mouseover", function() {
            d3.select(this)
            .attr("r", 10)
            .attr("fill-opacity", 1)
            return tooltip2.style("visibility", "visible")
        })
        .on("mousemove", function(d){
            return tooltip2
                .style("top", (d3.event.pageY+10)+"px")
                .style("left",(d3.event.pageX+10)+"px")
                .text(d.name + "- Edad: " + d.age + "- dif con Leo: " + (age(d.year)-d.age))
            })

        .on("mouseout", function() {
            d3.select(this)
                .attr("r", 5)
                .attr("fill-opacity", 0.2)
                return tooltip2.style("visibility", "hidden")
    })

    grupoElementos.append("text")
        .text('Línea = Edad de Leo Dicaprio')
        .attr("x",  margen.izquierdo)
        .attr("y", (margen.izquierdo + margen.derecho))
        .attr("fill", 'blue')
        

    grupoElementos.append("text")
        .text('Barras = Edad de las novias de Leo Dicaprio')
        .attr("x", margen.izquierdo)
        .attr("y", 150)



    console.log(data)
})

