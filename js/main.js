

//win/loss percentage bar -> win/loss/tie pie breakdown

//full season vs regular season

(function(){


	window.onload = setup();
	var dropdownArray = [];
	var expressed = "";

	function setup(){

		
				        console.log("test");
	     	// console.log(data/stats.json);
	        // createDropdown(minnwisc);

	        $.getJSON("data/stats.json", function(mydata) {
			    console.log(mydata); // this will show the info it in firebug console

			    console.log(mydata[0]);
			    for (var key in mydata[0]) {
				  if (mydata[0].hasOwnProperty(key) && key != "Name") {
				    dropdownArray.push(key);
				  }
				}

			     createDropdown(mydata);
			});
	        // var mydata = JSON.parse(stats);
	        // console.log(mydata);
	   
	}

	function createDropdown(data){

		var dropdown = d3.select("body")
            .append("select")
            .attr("class", "dropdown")
            .on("change", function(){
            	expressed = this.value;
            	graphs();
                // setData(data, this.value);
            });

        //add initial option
        var titleOption = dropdown.append("option")
            .attr("class", "titleOption")
            .attr("disabled", "true")
            .text("Select Stat");

        //add attribute name options
        var attrOptions = dropdown.selectAll("attrOptions")
            .data(dropdownArray)
            .enter()
            .append("option")
            .attr("value", function(d){ return d })
            .text(function(d){ return d });



	}

	function graphs(){
		d3.select(".barChart").remove();

		// if(expressed == "Win Percenage"){

		// }else{

		// }

		// set the dimensions of the canvas

		function barChart(){
			var margin = {top: 20, right: 20, bottom: 70, left: 40},
			    width = 600 - margin.left - margin.right,
			    height = 300 - margin.top - margin.bottom;


			// set the ranges
			var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

			var y = d3.scale.linear().range([height, 0]);

			// define the axis
			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom")


			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .ticks(10);


			// add the SVG element
			var svg = d3.select("body").append("svg")
				.attr("class", "barChart")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", 
			          "translate(" + margin.left + "," + margin.top + ")");

			// load the data
			d3.json("data/stats.json", function(error, data) {

			    data.forEach(function(d) {
			        d.Name = d.Name;
			        d[expressed] = +d[expressed];
			    });
				
			  // scale the range of the data
			  x.domain(data.map(function(d) { return d.Name; }));
			  y.domain([0, d3.max(data, function(d) { return d[expressed]; })]);

			  // add axis
			  svg.append("g")
			      .attr("class", "x axis")
			      .attr("transform", "translate(0," + height + ")")
			      .call(xAxis)
			    .selectAll("text")
			      .style("text-anchor", "end")
			      .attr("dx", "-.8em")
			      .attr("dy", "-.55em")
			      .attr("transform", "rotate(-90)" );

			  svg.append("g")
			      .attr("class", "y axis")
			      .call(yAxis)
			    .append("text")
			      .attr("transform", "rotate(-90)")
			      .attr("y", 5)
			      .attr("dy", ".71em")
			      .style("text-anchor", "end");


			  // Add bar chart
			  var bars = svg.selectAll("bar")
			      .data(data)
			    .enter().append("rect")
			      .attr("class", function(d) { return d.Name; })
			      .attr("x", function(d) { return x(d.Name); })
			      .attr("width", x.rangeBand())
			      .attr("y", function(d) { return y(d[expressed]); })
			      .attr("height", function(d) { return height - y(d[expressed]); })
			      .on("mouseover",function(d){ mouseover(d)})
			      .on("mouseout",function(d){ mouseout(d)})
			      .on("mousemove", function(d){mousemove()});


		      var desc = bars.append("desc")
	            .text('{"stroke": "none", "stroke-width": "0px"}');

			});
				

			function mouseover(d){
				// pieChart(d);
				highlight(d);
				setLabel(d);
			}

			function mouseout(d){
				dehighlight(d);
				removeLabel(d);
				// removePieChart();
			}

			function mousemove(){
				moveLabel();
			}
				
		}
	

		function highlight(d){
			console.log(d);
			d3.selectAll("rect." + d.Name)
	            .style({
	                "stroke": "blue",
	                "stroke-width": "2"
	            });

		}

		function dehighlight (d){
			console.log("dehighlight");
			var selected = d3.selectAll('rect.' + d.Name)
	            .style({
	                "stroke": function(){
	                    return getStyle(this, "stroke")
	                },
	                "stroke-width": function(){
	                    return getStyle(this, "stroke-width")
	                }
	            });

	        function getStyle(element, styleName){
	            var styleText = d3.select(element)
	                .select("desc")
	                .text();

	            var styleObject = JSON.parse(styleText);

	            return styleObject[styleName];
	        }
		}

		function setLabel(d){

		 	var key = expressed;
		 	var val = d[key];
	        
	        var labelAttribute = "<h1>" + d.Name +
	            "</h1><br><b>" + key +": "+ val+  "</b>";

	        //create info label div
	        var infolabel = d3.select("body")
	            .append("div")
	            .attr({
	                "class": "infolabel",
	                "id": d.Name + "_label"
	            })
	            .html(labelAttribute);

	    };

	    function removeLabel(d){
	    	d3.select(".infolabel")
	            .remove();
	    }
	    function removePieChart(){
	    	d3.select(".pieChart")
	            .remove();
	    }

	    function moveLabel(){
	    	 //get width of label
	    	 console.log("moveLabel");
	        var labelWidth = d3.select(".infolabel")
	            .node()
	            .getBoundingClientRect()
	            .width;

	        //use coordinates of mousemove event to set label coordinates
	        var x1 = d3.event.clientX + 10,
	            y1 = d3.event.clientY - 75,
	            x2 = d3.event.clientX - labelWidth - 10,
	            y2 = d3.event.clientY + 25;

	        //horizontal label coordinate, testing for overflow
	        var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1; 
	        //vertical label coordinate, testing for overflow
	        var y = d3.event.clientY < 75 ? y2 : y1; 

	        d3.select(".infolabel")
	            .style({
	                "left": x + "px",
	                "top": y + "px"
	            });
	    }

	    function pieChart(d){

	    	var AllWins = 0;
	    	var AllLosses = 0;
	    	var AllTies = 0;
	    	

    		d3.json("data/stats.json", function(error, data) {

			    data.forEach(function(d) {
			    	console.log("Wins:" + d.Wins);

			        d.Name = d.Name;
			        AllWins += d.Wins;
			        AllLosses += d.Losses;
			        AllTies += d.Ties;
			        d[expressed] = +d[expressed];

			    });

			    console.log("AllWins:" + AllWins);


	    	 	var w = 300,                        //stroke-width
			    h = 300,                            //height
			    r = 100,                            //radius
			    color = d3.scale.category20c();     //builtin range of colors

			    data = [{"label":"Wins", "value":AllWins}, 
			            {"label":"Losses", "value":AllLosses}, 
			            {"label":"Ties", "value":AllTies}];
			    
			    var vis = d3.select("body")
			        .append("svg:svg")
			        .attr("class", "pieChart")              //create the SVG element inside the <body>
			        .data([data])                   //associate our data with the document
			            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
			            .attr("height", h)
			        .append("svg:g")                //make a group to hold our pie chart
			            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

			    var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
			        .outerRadius(r);

			    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
			        .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

			    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
			        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
			        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
			            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
			                .attr("class", "slice");    //allow us to style things in the slices (like text)

			        arcs.append("svg:path")
			                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
			                .attr("d", arc)
			                .on("mouseover",function(d){ mouseover(d)})
						      .on("mouseout",function(d){ mouseout(d)})
						      .on("mousemove", function(d){mousemove()});                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

			        // arcs.append("svg:text")                                     //add a label to each slice
			        //         .attr("transform", function(d) {                    //set the label's origin to the center of the arc
			        //         //we have to make sure to set these before calling arc.centroid
			        //         d.innerRadius = r-50;
			        //         d.outerRadius = r;
			        //         return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
			        //     })
			        //     .attr("text-anchor", "middle")                          //center the text on it's origin
			        //     .text(function(d, i) { return data[i].label; });  

			    function pieUpdate(){
					var value = this.value;
				    clearTimeout(timeout);
				    pie.value(function(d) { return d[value]; }); // change the value function
				    path = path.data(pie); // compute the new angles
				    path.transition().duration(750).attrTween("d", arcTween); // redraw the arcs
				}


			});
	    	


			function mouseover(d){
				// pieChart(d);
				highlight(d);
				setLabel(d);
			}

			function mouseout(d){
				dehighlight(d);
				removeLabel(d);
				// removePieChart();
			}

			function mousemove(){
				moveLabel();
			}

			
			function arcTween(a) {
			  var i = d3.interpolate(this._current, a);
			  this._current = i(0);
			  return function(t) {
			    return arc(i(t));
			  };
			}
			

	    }

	    barChart();
	    pieChart();
	}
		

	
	// function setData(data, newExpressed){
	// 	data.foreach(function(d){
	// 		expressed = d[newExpressed];
	// 	})
	// }
	

})();