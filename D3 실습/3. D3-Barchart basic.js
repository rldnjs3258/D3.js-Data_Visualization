// ���� ����
var svgHeight=235
var barElements;
var dataSet = [120, 70, 175, 80, 220]; // ������
var offsetX = 40; // x��ǥ
var offsetY = 10; // y��ǥ
var y_range_limit = 300; // range limit ����
var interval = 5; // ����� ���� ��

// �׷����� ���� �׸��� ȯ�漳��1
var y = d3.scaleLinear() // ������ ���� ����
		.range([y_range_limit, 0]) // ����. ������ ����׷����� range()�� �ݴ�� ����
		.domain([0, 300]) // �ѷ��ִ� ����. y_range_limit�� ���� ���ߴ� ���� ����.
var ySclae = d3.axisLeft(y) // ������ ǥ�� ����
		.tickValues(d3.range(0, 301, 50)) // 0���� 300������ ��ǥ�� 50�� ǥ���Ѵ�.
		.tickFormat(function(d){ return " $$" + d}) // ������ ������ �����Ѵ�. ���Ƿ� $�� ǥ�������� �����̸� %, Ű�̸� cm �� �پ��ϰ� ǥ�� �����ϴ�.

// �׷����� ���� �׸��� ȯ�漳��2
d3.select("#myGraph").append("g") // ������ g ��Ҹ� ���� �׸�. g ��Ҵ� ��ü �׸��� translate ������ �� �����ϴ�.
		.attr("class", "axis") // html ���Ͽ��� �̸� ������ �� css ��ũ��Ʈ�� class�� �̿��Ѵ�.
		.attr("transform", "translate("+offsetX + ", "+((svgHeight-y_range_limit)-offsetY+")") // ��ǥ�� ��ȭ�� �ۿ������� �׷����� �����Ѵ�. ���� translate���� ��ġ�� ������ �� �׸��°� ����.
		.call(yScale) // ������ ���� �ҷ��´�.

// �׷��� �׸���
// barElements ȯ�溯�� ����
barElements = d3.select("#myGraph") // Id�� myGraph�� ����
		.selectAll("rect") // html�� �� ��ȭ���� svg �ȿ� rect�� �׸�
		.data[dataSet] // ������ �ε�

barElements.enter() // ������ ����
		.append("rect") // ������ �ð�ȭ�� rect�� �׸�
		.attr("class", "bar") // html ���Ͽ��� �̸� ������ �� css ��ũ��Ʈ�� class�� �̿��Ѵ�. (����Ʈ�� ������ �����ߴ�.)
		.attr("height", function(d){ return d;}) // rect�� height �Ӽ�. �������� ���� �̿��Ѵ�.
		.attr("width", "20") // rect�� width �Ӽ�
		.attr("x", function(d,i){return i * 30 + offsetX;}) // rect�� x�� �Ӽ�. �ε��� ���� 30ĭ�� ����.
		.attr("y", function(d){return svgHeight - d - offsetY;}) // rect�� y�� �Ӽ�. html�� ��ǥ�� ���� ����� (0,0)�̹Ƿ�, y ���� svgHeight���� ������ ���� �� ������ �̿��ؾ� �Ѵ�.

// �׷����� ������ text �ֱ�
// textElements ȯ�溯�� ����
textElements = d3.select("#myGraph") // Id�� myGraph�� ����
		.selectAll("#barNum") // html�� svg �ȿ� barNum�� �׸�
		.data[dataSet] // ������ �ε�

textElements.enter() // ������ ����
		.append("text") // ������ �ð�ȭ�� text�� �׸�
		.attr("class", "barNum") // html ���Ͽ��� �̸� ������ �� css ��ũ��Ʈ�� class�� �̿��Ѵ�. (�ؽ�Ʈ�� ������ �����ߴ�.)
		.attr("x", function(d, i){ return i * 30 + 10 + offsetX;}) // text�� x�� �Ӽ�. �ε��� ���� 30ĭ�� ����.
		.attr("y", svgHeight - 5 - offsetY) // text�� y�� �Ӽ�. svg�� �ϴ��� svgHeight���� 5�� �� ��ġ�̴�.
		.text(function(d){ return d;}) // text�� svg�� �׸���. text�� �������� ������ �����Ѵ�.

// �׷����� ��ǥ �׸���
d3.select("#myGraph").append("rect")
		.attr("class", "axis_x")
		.attr("width", 320)
		.attr("height", 1)
		.attr("transform", "translate("+offsetX + ", "+((svgHeight)-offsetY)+")")

// �׷����� �󺧸� text �ֱ�
// XElements ȯ�溯�� ����
XElements = d3.select("myGraph") // Id�� myGraph�� ����
		.selectAll("#barName") // html�� svg �ȿ� barName�� �׸�
		.data(dataSet) // ������ �ε�

XElements.enter() // ������ ����
		.append("text") // ������ �ð�ȭ�� text�� �׸�
		.attr("class", "barName") // html ���Ͽ��� �̸� ������ �� css ��ũ��Ʈ�� class�� �̿��Ѵ�. 
		.attr("x", function(d, i){ // text�� x�� �Ӽ�
			return i * 30 + 10 + interval + offsetX
		})
		.attr("y", svgHeight + 15 - offsetY) // text�� y�� �Ӽ�
		.text(function(d,i){
			return ["A", "B", "C", "D", "E"][i]; // ������ �� ���̺� ������ �ؽ�Ʈ�� �׸�
		}