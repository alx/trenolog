$.get("./logs/DATALOG_first.TXT", function(data){
  var data = jQuery.csv2json()(data);

  data.forEach(function(x){
    x.value = +x.value;
    x.timestamp = moment(+x.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
  });

  var datad3 = [],
      index = 0;
  data.forEach(function(x){
    if(index < 5000) {
      datad3.push(x.value);
    }
    index += 1;
  });

  var w = 1400,
  h = 200,
  margin = 20,
  y = d3.scale.linear().domain([0, d3.max(datad3)]).range([0 + margin, h - margin]),
  x = d3.scale.linear().domain([0, datad3.length]).range([0 + margin, w - margin]);

  var vis = d3.select("body")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
 
  var g = vis.append("svg:g")
    .attr("transform", "translate(0, 200)");

  var line = d3.svg.line()
    .x(function(d,i) { return x(i); })
    .y(function(d) { return -1 * y(d); })

  g.append("svg:path").attr("d", line(datad3));



});
