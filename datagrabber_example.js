const sampleTimeSec = 0.1; 					///< sample time in sec
const sampleTimeMsec = 1000*sampleTimeSec;	///< sample time in msec
const maxSamplesNumber = 100;				///< maximum number of samples
var lastTimeStamp; ///< most recent time stamp 
var lastTimeStamp2; ///< most recent time stamp 
var lastTimeStamp3; ///< most recent time stamp 



var xdata; ///< x-axis labels array: time stamps
var ydata; ///< y-axis data array: sensor data
var ydata_hum;
var ydata_pres;

var chartContext;  ///< chart context i.e. object that "owns" chart
var chart; ///< Chart.js object
var timer; ///< request timer




var xdata_rpy;
var ydata_pitch;
var ydata_roll;
var ydata_yaw;

var chartContext2;
var chart2;
var timer2;

var xdata_joy;
var ydata_x;
var ydata_y;
var ydata_mid;

var chartContext3;
var chart3;
var timer3;

const url = 'http://192.168.1.3/chartdata.json'; ///< server app with JSON API

/**
* @brief Generate random value.
* @retval random number from range <-1, 1>
*/
function getRand() {
	const maxVal =  1.0;
	const minVal = -1.0;
	return (maxVal-minVal)*Math.random() + minVal;
}

/**
* @brief Add new value to next data point.
* @param y New y-axis value 
*/

///chart 1 temp/hum/press update
function addData(y){
	if(ydata.length  > maxSamplesNumber)
	{
		removeOldData1();
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata.push(+y.temperature);
	ydata_pres.push(+y.pressure);
	ydata_hum.push(+y.humidity);
	chart.update();
}

///chart 2 rpy update
function addData2(y){
	if(ydata_pitch.length || ydata_roll.length || ydata_pitch.length > maxSamplesNumber)
	{
		removeOldData2();
		lastTimeStamp2 += sampleTimeSec;
		xdata_rpy.push(lastTimeStamp2.toFixed(4));
	}
	ydata_pitch.push(+y.pitch);
	ydata_yaw.push(+y.yaw);
	ydata_roll.push(+y.roll);
	chart2.update();
}

///chart 3 joystick
function addData3(y){
	if(ydata_x.length || ydata_y.length || ydata_mid.length > maxSamplesNumber)
	{
		removeOldData3();
		lastTimeStamp3 += sampleTimeSec;
		xdata_joy.push(lastTimeStamp3.toFixed(4));
	}
	ydata_x.push(+y.x);
	ydata_y.push(+y.y);
	ydata_mid.push(+y.mid);
	chart3.update();
}

/**
* @brief Remove oldest data point.
*/

///temp/hum/press
function removeOldData1(){
	xdata.splice(0,1);
	ydata.splice(0,1);
	ydata_pres.splice(0,1);
	ydata_hum.splice(0,1);
}
///rpy
function removeOldData2(){
	xdata_rpy.splice(0,1);
	ydata_pitch.splice(0,1);
	ydata_roll.splice(0,1);
	ydata_yaw.splice(0,1);
}

///joystick
function removeOldData3(){
	xdata_joy.splice(0,1);
	ydata_x.splice(0,1);
	ydata_y.splice(0,1);
	ydata_mid.splice(0,1);
}


/**
* @brief Start request timer
*/
function startTimer1(){
	timer = setInterval(ajaxJSON, sampleTimeMsec);
}

function startTimer2(){
	timer2 = setInterval(ajaxJSON2, sampleTimeMsec);
}

function startTimer3(){
	timer3 = setInterval(ajaxJSON3, sampleTimeMsec);
}

/**
* @brief Stop request timer
*/
function stopTimer1(){
	clearInterval(timer);
}

function stopTimer2(){
	clearInterval(timer2);
}

function stopTimer3(){
	clearInterval(timer3);
}

/**
* @brief Send HTTP GET request to IoT server
*/
function ajaxJSON() {
	$.ajax(url, {
		type: 'GET', dataType: 'json',
		success: function(responseJSON, status, xhr) {
			addData(responseJSON);
	
		}
	});
}

function ajaxJSON2() {
	$.ajax(url, {
		type: 'GET', dataType: 'json',
		success: function(responseJSON, status, xhr) {
			addData2(responseJSON);
			
			
		}
	});
}

function ajaxJSON3() {
	$.ajax(url, {
		type: 'GET', dataType: 'json',
		success: function(responseJSON, status, xhr) {
	
			addData3(responseJSON);
			
		}
	});
}

/**
* @brief Chart initialization
*/
function chartInit()
{
	/// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata);

	/// last value of 'xdata'
	lastTimeStamp = +xdata[xdata.length-1]; 

	/// empty array
	ydata = []; 
	ydata_hum = [];
	ydata_pres = []; 
 


	// get chart context from 'canvas' element
	chartContext = $("#chart")[0].getContext('2d');

	chart = new Chart(chartContext, {
		/// The type of chart: linear plot
		type: 'line',

		/// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'Temperarure',
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
				data: ydata,
				lineTension: 0
			},
			{
				fill: false,
				label: 'Humidity',
				backgroundColor: 'rgb(0, 255, 0)',
				borderColor: 'rgb(0, 255, 0)',
				data: ydata_hum,
				lineTension: 0
			},
			{
				fill: false,
				label: 'Pressure',
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: ydata_pres,
				lineTension: 0
			},]
		},

		/// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Sensor Data'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});

	ydata = chart.data.datasets[0].data;
	xdata = chart.data.labels;
}


function chartInit2()
{
	/// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata_rpy = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata_rpy.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata_rpy);

	/// last value of 'xdata'
	lastTimeStamp2 = +xdata_rpy[xdata_rpy.length-1]; 

	/// empty array
	ydata_yaw = []; 
	ydata_roll = [];
	ydata_pitch = []; 
 


	// get chart context from 'canvas' element
	chartContext2 = $("#chart2")[0].getContext('2d');

	chart2 = new Chart(chartContext2, {
		/// The type of chart: linear plot
		type: 'line',

		/// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata_rpy,
			datasets: [{
				fill: false,
				label: 'Roll',
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
				data: ydata_roll,
				lineTension: 0
			},
			{
				fill: false,
				label: 'Pitch',
				backgroundColor: 'rgb(0, 255, 0)',
				borderColor: 'rgb(0, 255, 0)',
				data: ydata_pitch,
				lineTension: 0
			},
			{
				fill: false,
				label: 'Yaw',
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: ydata_yaw,
				lineTension: 0
			},]
		},

		/// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Angle[°]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});

	ydata_pitch = chart2.data.datasets[0].data;
	xdata_rpy = chart2.data.labels;
}



function chartInit3()
{
	/// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata_joy = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata_joy.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata_joy);

	/// last value of 'xdata'
	lastTimeStamp3 = +xdata_joy[xdata_joy.length-1]; 

	/// empty array
	ydata_x = []; 
	ydata_y = [];
	ydata_mid = []; 
 


	// get chart context from 'canvas' element
	chartContext3 = $("#chart3")[0].getContext('2d');

	chart3 = new Chart(chartContext3, {
		/// The type of chart: linear plot
		type: 'line',

		/// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata_joy,
			datasets: [{
				fill: false,
				label: 'x',
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
				data: ydata_x,
				lineTension: 0
			},
			{
				fill: false,
				label: 'y',
				backgroundColor: 'rgb(0, 255, 0)',
				borderColor: 'rgb(0, 255, 0)',
				data: ydata_y,
				lineTension: 0
			},
			{
				fill: false,
				label: 'mid',
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: ydata_mid,
				lineTension: 0
			},]
		},

		/// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Position[-]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});

	ydata_x = chart3.data.datasets[0].data;
	xdata_joy = chart3.data.labels;
}



$(document).ready(() => { 

	///first chart temp/hum/press
	chartInit();
	$("#start").click(startTimer1);
	$("#stop").click(stopTimer1);
	$("#sampletime").text(sampleTimeMsec.toString());
	$("#samplenumber").text(maxSamplesNumber.toString());


	///second chart rpy
	chartInit2();
	$("#start2").click(startTimer2);
	$("#stop2").click(stopTimer2);
	$("#sampletime2").text(sampleTimeMsec.toString());
	$("#samplenumber2").text(maxSamplesNumber.toString());

	///third chart joystick
	chartInit3();
	$("#start3").click(startTimer3);
	$("#stop3").click(stopTimer3);
	$("#sampletime3").text(sampleTimeMsec.toString());
	$("#samplenumber3").text(maxSamplesNumber.toString());
});




///buttons
$(document).ready(function () {
	///temp,hum,press
	$('#exercise1').on('click', function () {
		$('#datagrabber').toggle('active');
		
	});
	///rpy
	$('#exercise1').on('click', function () {
		$('#datagrabber2').toggle('active');
		
	});
	///joystick
	$('#exercise1').on('click', function () {
		$('#datagrabber3').toggle('active');
		
	});
	///logo
	$('#menu').on('click', function () {
		$('#logo').toggle('active');
		
	});	
	///display
	$('#exercise2').on('click', function () {
		$('#led').toggle('active');
		
	});
	///sidebar
	$('#sidebarCollapse').on('click', function () {
		$('#sidebar').toggleClass('active');
		$(this).toggleClass('active');
	});
});