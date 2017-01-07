

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

		// set the dimensions of the canvas
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
		      .style("text-anchor", "end")
		      .text("Frequency");


		  // Add bar chart
		  svg.selectAll("bar")
		      .data(data)
		    .enter().append("rect")
		      .attr("class", "bar")
		      .attr("x", function(d) { return x(d.Name); })
		      .attr("width", x.rangeBand())
		      .attr("y", function(d) { return y(d[expressed]); })
		      .attr("height", function(d) { return height - y(d[expressed]); });

		});
	}

	// function setData(data, newExpressed){
	// 	data.foreach(function(d){
	// 		expressed = d[newExpressed];
	// 	})
	// }
	

})();