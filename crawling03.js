// hanbit.co.kr 사이트에서 새로 나온 책에 대한 정보를 긁어오기
// https://www.hanbit.co.kr/store/books/new_book_list.html

// 사용할 패키지 가져오기: require(패키지명)
const axios = require('axios');
const cheerio = require('cheerio');

const fs = require('fs');       // 파일시스템 관련 라이브러리
const path = require('path');   // 파일 경로 관련 라이브러리

async function main() {   // 비동기 I/O 지원 함수 정의

    // 접속할 url 지정
    const URL = 'https://www.hanbit.co.kr/store/books/new_book_list.html'

    // 수집한 개별 정보를 저장하기 위해 배열 선언
    let titles = [], writers = [], prices = [];
    let books = [];

    // axios로 접속해서 html을 불러옴
    const html = await axios.get(URL, {
        headers : {'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0'}
    });   // 서버 요청 시 User-Agent 헤더 사용

    // 불러온 html을 parsing 해서 DOM 생성
    const dom = cheerio.load(html.data);
    // console.log(dom);

    // CSS 선택자로 도서 제목을 지정
    let elements = dom('.book_tit');

    // 찾은 요소를 순회하면서 요소의 텍스트 출력
    elements.each((idx, title) => {
        // console.log(dom(title).text());
        titles.push(dom(title).text());   // 배열에 추가
    });

    // CSS 선택자로 저자를 담고 있는 요소 지정
    elements = dom('.book_writer');

    elements.each((idx, writer) => {
        // console.log(dom(writer).text());
        writers.push(dom(writer).text());   // 배열에 추가
    });

    // CSS 선택자로 가격을 담고 있는 요소 지정
    elements = dom('.price');

    elements.each((idx, price) => {
        // console.log(dom(price).text());
        prices.push(dom(price).text());   // 배열에 추가
    });

    // 저장된 배열 요소 갯수 확인
    console.log(titles.length, writers.length, prices.length);

    // 수집한 정보들을 JSON 객체로 생성
    for (let i = 0; i < titles.length; ++i) {
        let book = {};
        book.title = titles[i];
        book.writer = writers[i].replace(/ /g, '');
        book.price = prices[i].replace(/[,|원]/g, '');
        books.push(book);
    }

    console.log(books);

    // 생성된 도서 객체를 JSON 문자열로 변환 하고
    const bookJSON = JSON.stringify(books);

    // data 라는 폴더가 있는지 확인 - 없으면 생성
    !fs.existsSync('data') && fs.mkdirSync('data');

    // 저장 위치와 파일명 지정 후 파일에 저장
    const fpath = path.join(__dirname, 'data', 'books.json');
    fs.writeFileSync(fpath, bookJSON);

}

main();