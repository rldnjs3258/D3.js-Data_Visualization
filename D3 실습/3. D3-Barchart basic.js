// 변수 설정
var svgHeight=235
var barElements;
var dataSet = [120, 70, 175, 80, 220]; // 데이터
var offsetX = 40; // x좌표
var offsetY = 10; // y좌표
var y_range_limit = 300; // range limit 정의
var interval = 5; // 사용자 지정 값

// 그래프의 눈금 그리기 환경설정1
var y = d3.scaleLinear() // 눈금의 종류 지정
		.range([y_range_limit, 0]) // 범위. 세로형 막대그래프는 range()를 반대로 설정
		.domain([0, 300]) // 뿌려주는 범위. y_range_limit과 값을 맞추는 것이 좋다.
var ySclae = d3.axisLeft(y) // 눈금의 표기 지정
		.tickValues(d3.range(0, 301, 50)) // 0에서 300까지의 좌표를 50씩 표기한다.
		.tickFormat(function(d){ return " $$" + d}) // 눈금의 단위를 지정한다. 임의로 $를 표시했지만 비율이면 %, 키이면 cm 등 다양하게 표기 가능하다.

// 그래프의 눈금 그리기 환경설정2
d3.select("#myGraph").append("g") // 눈금은 g 요소를 통해 그림. g 요소는 전체 그림을 translate 지정할 때 용이하다.
		.attr("class", "axis") // html 파일에서 미리 지정해 둔 css 스크립트인 class를 이용한다.
		.attr("transform", "translate("+offsetX + ", "+((svgHeight-y_range_limit)-offsetY+")") // 좌표는 도화지 밖에서부터 그려지기 시작한다. 따라서 translate으로 위치를 지정한 후 그리는게 좋다.
		.call(yScale) // 정의한 값을 불러온다.

// 그래프 그리기
// barElements 환경변수 설정
barElements = d3.select("#myGraph") // Id로 myGraph을 설정
		.selectAll("rect") // html의 빈 도화지인 svg 안에 rect를 그림
		.data[dataSet] // 데이터 로드

barElements.enter() // 데이터 진입
		.append("rect") // 데이터 시각화로 rect를 그림
		.attr("class", "bar") // html 파일에서 미리 지정해 둔 css 스크립트인 class를 이용한다. (바차트의 색상을 지정했다.)
		.attr("height", function(d){ return d;}) // rect의 height 속성. 데이터의 값을 이용한다.
		.attr("width", "20") // rect의 width 속성
		.attr("x", function(d,i){return i * 30 + offsetX;}) // rect의 x축 속성. 인덱스 별로 30칸씩 띄운다.
		.attr("y", function(d){return svgHeight - d - offsetY;}) // rect의 y축 속성. html의 좌표는 왼쪽 상단이 (0,0)이므로, y 값은 svgHeight에서 데이터 값을 뺀 값으로 이용해야 한다.

// 그래프에 데이터 text 넣기
// textElements 환경변수 설정
textElements = d3.select("#myGraph") // Id로 myGraph을 설정
		.selectAll("#barNum") // html의 svg 안에 barNum을 그림
		.data[dataSet] // 데이터 로드

textElements.enter() // 데이터 진입
		.append("text") // 데이터 시각화로 text를 그림
		.attr("class", "barNum") // html 파일에서 미리 지정해 둔 css 스크립트인 class를 이용한다. (텍스트의 색상을 지정했다.)
		.attr("x", function(d, i){ return i * 30 + 10 + offsetX;}) // text의 x축 속성. 인덱스 별로 30칸씩 띄운다.
		.attr("y", svgHeight - 5 - offsetY) // text의 y축 속성. svg의 하단인 svgHeight에서 5를 뺀 위치이다.
		.text(function(d){ return d;}) // text를 svg에 그린다. text는 데이터의 값으로 설정한다.

// 그래프의 좌표 그리기
d3.select("#myGraph").append("rect")
		.attr("class", "axis_x")
		.attr("width", 320)
		.attr("height", 1)
		.attr("transform", "translate("+offsetX + ", "+((svgHeight)-offsetY)+")")

// 그래프에 라벨명 text 넣기
// XElements 환경변수 설정
XElements = d3.select("myGraph") // Id로 myGraph을 설정
		.selectAll("#barName") // html의 svg 안에 barName을 그림
		.data(dataSet) // 데이터 로드

XElements.enter() // 데이터 진입
		.append("text") // 데이터 시각화로 text를 그림
		.attr("class", "barName") // html 파일에서 미리 지정해 둔 css 스크립트인 class를 이용한다. 
		.attr("x", function(d, i){ // text의 x축 속성
			return i * 30 + 10 + interval + offsetX
		})
		.attr("y", svgHeight + 15 - offsetY) // text의 y축 속성
		.text(function(d,i){
			return ["A", "B", "C", "D", "E"][i]; // 지정해 둔 레이블 네임을 텍스트로 그림
		}