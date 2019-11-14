var margin = { left:80, right:20, top:50, bottom:100 };
var height = 500 - margin.top - margin.bottom,
     width = 800 - margin.left - margin.right;

// ���� g�� svg��, �׸��� �׸� ��ȭ����� �����ϸ� �ȴ�.
var g = d3.select{"#chart-area"} // Id�� "#char-area" ������. html�� <div id="chart-area">�� �κп� �׸���.
	.append("svg") // svg ����
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

// �÷��� �� ǥ��
var colorText = g.slectAll("text").data(d3.entries(colors)) // selectAll�� ���� colors �����͸� �޾ƿ´�.
	colorText.enter() // colorText�� �����Ѵ�.
		.append("text") // "text"�� �̿��Ѵ�.
		.attr("class", "colors")
		.attr("y", function(d, i){return height+40+15+i;})
		.attr("x", width-40)
		.attr("font-size", "20px")
		.style("fill", function(d){return d.value;}) // colors ������ �� value ���� �̿��Ѵ�.
		.style("opacity", "0.8")
		.style("text-anchor", "middle")
		.text(function(d){return d.key;}); // colors ������ �� key ���� �̿��Ѵ�.

// Scales
var x = d3.scaleLog() // x�� scaleLog �̿�
	.range([0, width])
	.domain([142, 120000]); // 142 ~ 120000�� ���� 0 ~ width������ ������ ��ô�Ѵ�.
var y = d3.scaleLinear() // y�� scaleLinear �̿�
	.range([height, 0])
	.domain([0, 90]); // 0 ~ 90�� ���� height ~ 0������ ������ ��ô�Ѵ�.
var area = d3.scaleLinear()
	.range([25 * Math.PI, 1500 * Math.PI])
	.domain([2000, 1400000000]);

// �� �� ����
// x�� �� : GDP
var xLabel = g.append("text") // ��ȭ���� g�� �߰�!
	.attr("y", height + 50)
	.attr("x", width / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)");

// y�� �� : ��� ����
var yLabel = g.append("text") // ��ȭ���� g�� �߰�!
	.attr("transform", "rotate(-90)") // �������� 90�� ����
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Life Expentancy (Years)")

// �߰� �� : Time
var timeLabel = g.append("text") // ��ȭ���� g�� �߰�!
	.attr("y", height - 10)
	.attr("x", width - 40)
	.attr("font-size", "40px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text("1800"); // 1800�⵵���� ����

// Axis
// X��
var xAxisCall = d3.axisBottom(x) // axisBottom �̿�
	.tickValues([400, 4000, 40000]) // ���� ��
	.tickFormat(d3.format("$")); // ���� ���� (���� ����)
g.append("g") // ��ȭ���� g�� �߰�!
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxisCall);

// Y��
var yAxisCall = d3.axisLeft(y)
	.tickFormat(function(d) return +d;});
g.append("g")
	.attr("class", "y axis")
	.call(yAxisCall);

// ������ �ε�
d3.json("/������ ��ġ �ۼ��ϱ�.json", function(data){
	console.log(data); // �������� �α׸� Ȯ���Ѵ�.

	const formattedData = data.map(function(year){ // data.map���� �ǽð����� array�� �о �����͸� �ѷ��� �� �ִ�.
		return year["countries"].map(function(country){
			return country;
		}
	};

	d3.interval(function(){ // interval�� ���� �ð����� ������Ʈ �� �� �ִ�.
		time = (time < 214) ? time+1 : 0 // 1800 ~ 2014�� �̱� ������ 214�̴�. True�� �� time+1�� �ϰ�, False�� �� 0���� �ʱ�ȭ�Ѵ�.
		update(formattedData[time]); // time ���� ������Ʈ �Ѵ�.
	}, 100) // 100ms ���� ������Ʈ!

	update(formattedData[0]);
})

// ������Ʈ �Լ�
function update(data) {
	var t = d3.transition() // ����� �ð��� 0.5�ʰ� �ǰ� �Ѵ�.
		.duration(500) // 0.5��

	var circles = g.selctAll("circle").data(data, function(d){ // circle�� �׸� ���̴�.
		return d.country; // �����͸� array ���� �ϳ� �ϳ��� �����´�.
	});

	circles.exit() // ������Ʈ �Ǵ� ���� ���� �����͸� �����.
		.remove();

	circles.enter() // circles ����
		.append("circle")
		.attr("class", "enter")
		.attr("fill", function(d) {return colors[d.continent];}) // �տ��� �̸� ������ color ������ �̿���, �������� continent���� ������ ĥ�Ѵ�.
		.merge(circles) // ���� �����͸� ������Ʈ�� ���� ������ ��ȯ�ϱ� ���� merge�� �̿��Ѵ�.
		.translation(t) // 0.5��
			.attr("cx", function(d){return x(d.income);}) // cx���� ������ �� income �����̴�. x()�� ���� ��ô �̿���.
			.attr("cy", function(d){return y(d.life_exp);}) // cy���� ������ �� ��� �����̴�. y()�� ���� ��ô �̿���.
			.attr("r", function(d){return Math.sqrt(area(d.population) / Math.PI);}) // ���� ũ��� ������ �� �α��� ������ �޴´�.