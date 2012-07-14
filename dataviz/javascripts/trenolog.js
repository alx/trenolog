// Fix map for IE
if (!('map' in Array.prototype)) { 
  Array.prototype.map = function (mapper, that /*opt*/) { 
    var other = new Array(this.length); 
    for (var i = 0, n = this.length; i < n; i++) 
      if (i in this) 
        other[i] = mapper.call(that, this[i], i, this); 
    return other; 
  }; 
};

var browser = BrowserDetect;

var buckets = 11,
    colorScheme = 'rbow2',
    days = [
      { name: 'Monday', abbr: 'Mo' },
      { name: 'Tuesday', abbr: 'Tu' },
      { name: 'Wednesday', abbr: 'We' },
      { name: 'Thursday', abbr: 'Th' },
      { name: 'Friday', abbr: 'Fr' },
      { name: 'Saturday', abbr: 'Sa' },
      { name: 'Sunday', abbr: 'Su' }
    ],
    hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'];

var data;

d3.select('#vis').classed(colorScheme, true);

d3.json('noise.json', function(json) {

  data = json;

  createTiles();
  reColorTiles('all', 'all');

  /* ************************** */

  // tiles mouseover events
  $('#tiles td').hover(function() {

    $(this).addClass('sel');

  }, function() {

    $(this).removeClass('sel');

  });

});

/* ************************** */

function isOldBrowser() {

  var result = false;
  if (browser.browser === 'Explorer' && browser.version < 9) {
    result = true;
  } else if (browser.browser === 'Firefox' && browser.version < 4) {
    result = true;
  }
  
  //console.log(result);
  
  return result;
}

/* ************************** */

function getCalcs(date) {
  
  var min = 1,
    max = -1;
  
  // calculate min + max
  for (var d = 0; d < data[date].noise.length; d++) {
    for (var h = 0; h < data[date].noise[d].length; h++) {
      
      var tot = data[date].noise[d][h];
      
      if (tot > max) {
        max = tot;
      }
      
      if (tot < min) {
        min = tot;
      }
    }
  }
  
  return {'min': min, 'max': max};
};

/* ************************** */

function reColorTiles(date) {
  
  var calcs = getCalcs(date),
    range = [];
  
  for (var i = 1; i <= buckets; i++) {
    range.push(i);
  }
  
  var bucket = d3.scale.quantize().domain([0, calcs.max > 0 ? calcs.max : 1]).range(range),
    side = d3.select('#tiles').attr('class');
  
  
  if (side === 'front') {
    side = 'back';
  } else {
    side = 'front';
  }
  
  for (var d = 0; d < data[date].noise.length; d++) {
    for (var h = 0; h < data[date].noise[d].length; h++) {

      var sel = '#d' + d + 'h' + h + ' .tile .' + side,
          val = data[date].noise[d][h];
      
      // erase all previous bucket designations on this cell
      for (var i = 1; i <= buckets; i++) {
        var cls = 'q' + i + '-' + buckets;
        d3.select(sel).classed(cls , false);
      }
      
      // set new bucket designation for this cell
      var cls = 'q' + (val > 0 ? bucket(val) : 0) + '-' + buckets;
      d3.select(sel).classed(cls, true);
    }
  }
  flipTiles();
}

/* ************************** */

function flipTiles() {

  var oldSide = d3.select('#tiles').attr('class'),
    newSide = '';
  
  if (oldSide == 'front') {
    newSide = 'back';
  } else {
    newSide = 'front';
  }
  
  var flipper = function(h, d, side) {
    return function() {
      var sel = '#d' + d + 'h' + h + ' .tile',
        rotateY = 'rotateY(180deg)';
      
      if (side === 'back') {
        rotateY = 'rotateY(0deg)';  
      }
      if (browser.browser === 'Safari' || browser.browser === 'Chrome') {
        d3.select(sel).style('-webkit-transform', rotateY);
      } else {
        d3.select(sel).select('.' + oldSide).classed('hidden', true);
        d3.select(sel).select('.' + newSide).classed('hidden', false);
      }
        
    };
  };
  
  for (var h = 0; h < hours.length; h++) {
    for (var d = 0; d < days.length; d++) {
      var side = d3.select('#tiles').attr('class');
      setTimeout(flipper(h, d, side), (h * 20) + (d * 20) + (Math.random() * 100));
    }
  }
  d3.select('#tiles').attr('class', newSide);
}

/* ************************** */

function createTiles() {

  var html = '<table id="tiles" class="front">';

  html += '<tr><th><div>&nbsp;</div></th>';

  for (var h = 0; h < hours.length; h++) {
    html += '<th class="h' + h + '">' + hours[h] + '</th>';
  }
  
  html += '</tr>';

  for (var d = 0; d < days.length; d++) {
    html += '<tr class="d' + d + '">';
    html += '<th>' + days[d].abbr + '</th>';
    for (var h = 0; h < hours.length; h++) {
      html += '<td id="d' + d + 'h' + h + '" class="d' + d + ' h' + h + '"><div class="tile"><div class="face front"></div><div class="face back"></div></div></td>';
    }
    html += '</tr>';
  }
  
  html += '</table>';
  d3.select('#vis').html(html);
}
