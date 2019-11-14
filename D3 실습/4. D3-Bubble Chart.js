var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom,
     width = 800 - margin.left - margin.right;

// 변수 g는 svg로, 그림을 그릴 도화지라고 생각하면 된다.
var g = d3.select{"#chart-area"} // Id로 "#char-area" 선택함. html의 <div id="chart-area">인 부분에 그린다.
	.append("svg") // svg 생성
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

var time = 0;

var colors = { // "key": "value"
	"americas": "#5687d1",
	"africa": "#5c7b51",
	"asia": "#de783b",
	"europe": "#6ab975",
};

// 컬러의 라벨 표시
var colorText = g.slectAll("text").data(d3.entries(colors)) // selectAll을 통해 colors 데이터를 받아온다.
	colorText.enter() // colorText에 진입한다.
		.append("text") // "text"를 이용한다.
		.attr("class", "colors")
		.attr("y", function(d, i){return height+40+15+i;})
		.attr("x", width-40)
		.attr("font-size", "20px")
		.style("fill", function(d){return d.value;}) // colors 데이터 중 value 값을 이용한다.
		.style("opacity", "0.8")
		.style("text-anchor", "middle")
		.text(function(d){return d.key;}); // colors 데이터 중 key 값을 이용한다.

// Scales
var x = d3.scaleLog() // x는 scaleLog 이용
	.range([0, width])
	.domain([142, 120000]); // 142 ~ 120000의 값을 0 ~ width까지의 값으로 축척한다.
var y = d3.scaleLinear() // y는 scaleLinear 이용
	.range([height, 0])
	.domain([0, 90]); // 0 ~ 90의 값을 height ~ 0까지의 값으로 축척한다.
var area = d3.scaleLinear()
	.range([25 * Math.PI, 1500 * Math.PI])
	.domain([2000, 1400000000]);

// 축 라벨 설정
// x축 라벨 : GDP
var xLabel = g.append("text") // 도화지인 g에 추가!
	.attr("y", height + 50)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)");

// y축 라벨 : 기대 수명
var yLabel = g.append("text") // 도화지인 g에 추가!
	.attr("transform", "rotate(-90)") // 좌측으로 90도 돌림
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Life Expentancy (Years)")

// 추가 라벨 : Time
var timeLabel = g.append("text") // 도화지인 g에 추가!
	.attr("y", height - 10)
	.attr("x", width - 40)
	.attr("font-size", "40px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text("1800"); // 1800년도부터 시작

// Axis
// X축
var xAxisCall = d3.axisBottom(x) // axisBottom 이용
	.tickValues([400, 4000, 40000]) // 축의 값
	.tickFormat(d3.format("$")); // 축의 단위 (생략 가능)
g.append("g") // 도화지인 g에 추가!
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxisCall);

// Y축
var yAxisCall = d3.axisLeft(y)
	.tickFormat(function(d) return +d;});
g.append("g")
	.attr("class", "y axis")
	.call(yAxisCall);

// 데이터 로드
d3.json("/데이터 위치 작성하기.json", function(data){
	console.log(data); // 데이터의 로그를 확인한다.

	const formattedData = data.map(function(year){ // data.map으로 실시간으로 array로 읽어서 데이터를 뿌려줄 수 있다.
		return year["countries"].map(function(country){
			return country;
		}
	};

	d3.interval(function(){ // interval로 일정 시간마다 업데이트 할 수 있다.
		time = (time < 214) ? time+1 : 0 // 1800 ~ 2014년 이기 때문에 214이다. True일 때 time+1을 하고, False일 때 0으로 초기화한다.
		update(formattedData[time]); // time 값을 업데이트 한다.
	}, 100) // 100ms 마다 업데이트!

	update(formattedData[0]);
})

// 업데이트 함수
function update(data) {
	var t = d3.transition() // 모션의 시간이 0.5초가 되게 한다.
		.duration(500) // 0.5초

	var circles = g.selctAll("circle").data(data, function(d){ // circle을 그릴 것이다.
		return d.country; // 데이터를 array 별로 하나 하나씩 가져온다.
	});

	circles.exit() // 업데이트 되는 동안 이전 데이터를 지운다.
		.remove();

	circles.enter() // circles 진입
		.append("circle")
		.attr("class", "enter")
		.attr("fill", function(d) {return colors[d.continent];}) // 앞에서 미리 지정한 color 변수를 이용해, 데이터의 continent마다 색상을 칠한다.
		.merge(circles) // 이전 데이터를 업데이트를 통해 데이터 변환하기 위해 merge를 이용한다.
		.translation(t) // 0.5초
			.attr("cx", function(d){return x(d.income);}) // cx값은 데이터 중 income 차원이다. x()를 통해 축척 이용함.
			.attr("cy", function(d){return y(d.life_exp);}) // cy값은 데이터 중 기대 수명이다. y()를 통해 축척 이용함.
			.attr("r", function(d){return Math.sqrt(area(d.population) / Math.PI);}) // 원의 크기는 데이터 중 인구에 영향을 받는다.