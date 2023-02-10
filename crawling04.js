// 미세먼지 공공데이터를 이용해서 특정 지역의 미세먼지 정보 출력
// https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty
// ?serviceKey=VDshietPX1L3q5ss8MYBjpPJgleqfA%2B6c46knZPaL67KMf6EdpYi%2FarP6JjXYixNuI3iZ1CEtjg5HU4TfCpXdg%3D%3D&returnType=json&numOfRows=100&pageNo=1&sidoName=%EC%84%9C%EC%9A%B8&ver=1.0

// 사용할 패키지 가져오기: require(패키지명)
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function main() {

    // 접속할 url, 쿼리스트링, 요청헤더 지정
    const URL = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty'
    const params = {'serviceKey':'VDshietPX1L3q5ss8MYBjpPJgleqfA+6c46knZPaL67KMf6EdpYi/arP6JjXYixNuI3iZ1CEtjg5HU4TfCpXdg==',
        'returnType':'json', 'sidoName':'전국', 'numOfRows':1000
    };
    const headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0'};

    // axios 로 접속해서 대기오염 정보를 불러옴
    const json = await axios.get(URL, {
        params : params,
        headers : headers
    });   // 서버 요청 시 User-Agent 헤더 사용

    // 받아온 데이터 잠시 확인
    // console.log(json.data);

    // JSON 으로 불러오기
    let items = json.data['response']['body']['items']
    // console.log(items);

    // 미세먼지 정보 출력
    // pm25Value는 출력 안 됨!!
    for (let item of items) {
        console.log(item.sidoName, item.stationName, item.pm10Value,
            item.dataTime);
    }
}

main();