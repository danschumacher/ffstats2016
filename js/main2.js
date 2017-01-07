

(function(){
	
	d3_queue.queue()
        .defer(d3.csv, "data/CommuterInfoFinal7.csv") //load attributes from csv
        .await(callback);

    function callback(error, csvData){
    	d3.select("body")
            .append("text")
            .attr("class", "title")
            .text("FF stats 2016");

     	console.log(csvData);
        // createDropdown(minnwisc);

    }

}