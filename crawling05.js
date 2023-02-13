// 코로나 19 시도별 확진자 데이터를 이용해서 특정 지역의 확진자 현황 출력
// https://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api
// ?serviceKey=VDshietPX1L3q5ss8MYBjpPJgleqfA%2B6c46knZPaL67KMf6EdpYi%2FarP6JjXYixNuI3iZ1CEtjg5HU4TfCpXdg%3D%3D&pageNo=1&numOfRows=500&apiType=json&std_day=2021-12-15&gubun=%EC%84%9C%EC%9A%B8

const axios = require('axios');
const { XMLParser } = require("fast-xml-parser");

async function main() {

    // 접속할 URL 지정
    // apiType : xml 또는 JSON(꼭 대문자)
    const URL = 'http://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api'
    const params = {'serviceKey':'VDshietPX1L3q5ss8MYBjpPJgleqfA+6c46knZPaL67KMf6EdpYi/arP6JjXYixNuI3iZ1CEtjg5HU4TfCpXdg==',
        'apiType':'xml', 'std_day':'2023-02-12', 'gubun':''
    };
    const headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0'};

    const xml = await axios.get(URL, {
        params : params,
        headers : headers
    });   // 서버 요청 시 User-Agent 헤더 사용

    // 받아온 데이터 잠시 확인
    // console.log(xml.data);

    // XML을 JSON으로 변환하기
    const parser = new XMLParser()
    let json = parser.parse(xml.data);

    // JSON으로 불러오기
    let items = json['response']['body']['items'];

    // 지역별 코로나 확진 정보 출력
    for (let item of items['item']) {
        console.log(`지역 : ${item.gubun}, 전일 확진자수 : ${item.incDec}, 
        누적 확진자수 : ${item.defCnt}, 누적 사망자수 : ${item.deathCnt}, 측정일 : ${item.stdDay}`);
    }

}

main();