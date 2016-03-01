var helpGraphHeight = $("#help-text").height() - 100;
console.log(helpGraphHeight);

var m = [30, 10, 10, 30],
    w = parseInt(d3.select('#help-graph').style('width')) - m[1]
    if (helpGraphHeight < 289) {
      var h = helpGraphHeight + 100; }
      else { var h = helpGraphHeight }

var format = d3.format(",.0f");

var chartWidth = w / 2 - 55;


d3.csv("data/help_data.csv", function(error, data) {
  if (error) throw error;

  // Parse numbers, and sort by all_help.
  data.forEach(function(d) { d.all_help = +d.all_help; });
  data.sort(function(a, b) { return b.all_help - a.all_help; });

  // Set the scale domain.
  var x = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.all_help; })])
      .range([0, chartWidth]);

  var x2 = d3.scale.linear()
      .domain([0, 1540])
      .range([0, chartWidth]);

  y = d3.scale.ordinal().rangeRoundBands([0, h], .1);
  y.domain(data.map(function(d) { return d.name; }));


  var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-h),
      yAxis = d3.svg.axis().scale(y).orient("left").tickSize(0);

  var svg = d3.select("#help-graph").append("svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h + m[0] + m[2])
      .append("g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

  var bar = svg.selectAll("g.bar")
      .data(data)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

  bar.append("rect")
      .attr("class","help_rect")
      .attr("x", w - chartWidth - 30)
      .attr("width", function(d) { return x(d.all_help); })
      .attr("height", y.rangeBand());

  var bar2 = svg.selectAll("g.bar2")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d) { return "translate(0," + y(d.name) + ")"; });

  bar2.append("rect")
      .attr("class", "car_rect")
      .attr("x", function(d) { return chartWidth - x2(d.car_price) - 30; })
      .attr("width", function(d) { return x2(d.car_price); })
      .attr("height", y.rangeBand());


  bar.append("text")
      .attr("class", "name")
      .attr("x", w-chartWidth-80)
      .attr("y", y.rangeBand() / 2)
      .attr("dx", -3)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return (d.name); })
      .on("mouseover", function() {
        d3.select(this).style("font-weight", "bold")
        var thisdata = d3.select(this).datum();
        d3.selectAll(".help_rect").style("fill", function(d) {
          if (d.name === thisdata.name) {return "#D85944" }
        })
        d3.selectAll(".car_rect").style("fill", function(d){
          if (d.name == thisdata.name) {return "#383E47"}
        })

       })
      .on("mouseout", function() {
        d3.select(this).style("font-weight", "normal")
        d3.selectAll(".help_rect").style("fill","#FB6A4A")
        d3.selectAll(".car_rect").style("fill", "#515A67")
      })
      .on('click', function(d, i) {
        window.location.href = "http://declarations.com.ua/declaration/" + d.id;
           });

  svg.append("text")
     .attr("class", "title")
     .attr("x", w-chartWidth - 30)
     .attr("y", -10)
     .attr("dx", -3)
     .attr("dy", ".35em")
     .attr("text-anchor", "start")
     .text("Фінансова допомога");

  svg.append("text")
     .attr("class", "title2")
     .attr("x", w - 2*chartWidth - 120)
     .attr("y", -10)
     .attr("dx", -3)
     .attr("dy", ".35em")
     .attr("text-anchor", "start")
     .text("Вартість машин сім'ї");

  bar.append("text")
     .attr("class", "help")
     .attr("x", function(d) { return x(d.all_help) + chartWidth + 68; })
     .attr("y", y.rangeBand() / 2)
     .attr("dx", -3)
     .attr("dy", ".35em")
     .attr("text-anchor", "middle")
     .text(function(d) { return (d.all_help); });

  bar2.append("text")
      .attr("class", "price")
      .attr("x", function(d) { return w - chartWidth - 122 - x2(d.car_price) })
      .attr("y", y.rangeBand() / 2)
      .attr("dx", -3)
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return (d.car_price); });

      d3.select(window).on('resize', resize);
      function resize() {
       helpGraphHeight = $("#help-text").height() - 100;
       w = parseInt(d3.select('#help-graph').style('width')) - m[1],
       h = helpGraphHeight + 100;
       chartWidth = w / 2 - 55;

       // Set the scale domain.
       x.range([0, chartWidth]);

       x2.range([0, chartWidth]);

       svg.selectAll(".help_rect")
           .attr("x", w - chartWidth - 30)
           .attr("width", function(d) { return x(d.all_help); });

       svg.selectAll(".car_rect")
           .attr("x", function(d) { return chartWidth - x2(d.car_price) - 30; })
           .attr("width", function(d) { return x2(d.car_price); });


       svg.selectAll(".name")
           .attr("x", w-chartWidth-80)
           .attr("dx", -3);

       svg.selectAll(".title")
          .attr("x", w-chartWidth - 30)
          .attr("dx", -3);

       svg.selectAll(".title2")
          .attr("x", w - 2*chartWidth - 120)
          .attr("dx", -3);

       svg.selectAll(".help")
          .attr("x", function(d) { return x(d.all_help) + chartWidth + 68; })
          .attr("dx", -3);

       svg.selectAll(".price")
           .attr("x", function(d) { return w - chartWidth - 122 - x2(d.car_price) })
           .attr("dx", -3);

        }
       });
