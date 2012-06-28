$.get("./logs/DATALOG_light.TXT", function(data){
  var data = jQuery.csv2json()(data);

  data.forEach(function(x){
    x.value = +x.value;
    x.timestamp = moment(+x.timestamp * 1000).format("YYYY-MM-DD HH:mm:ss");
  });

  Morris.Line({
    element: 'chart',
    data: data,
    xkey: 'timestamp',
    ykeys: ['value'],
    labels: ['Series A'],
    dateFormat: function(x){
      return new Date(x).toString();
    },
    smooth: false,
    pointSize: 0,
    lineWidth: 1,
    ymin: 0
  });
});
