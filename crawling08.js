// 셀레니엄을 이용해서 k-apt.go.kr에서 2023, 1월, 서울특별시, 강남구,
// 삼성동, 아이파크삼성동의 지상/지하 주차장 수 추출

const { Builder, Browser, By, Key, until, Select } = require('selenium-webdriver');
const ncp = require('copy-paste');

async function main() {
    const URL = 'http://k-apt.go.kr/';
    const chrome = await new Builder().forBrowser(Browser.CHROME)
        .build();

    try {
        // 사이트 접속
        await chrome.get(URL);

        // 우리단지 기본 정보 버튼이 표시될 때까지 5초 대기
        // await chrome.wait(until.elementLocated(By.css('#nav > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)')), 5000);
        await chrome.wait(until.elementLocated(By.xpath('//a[@title="우리단지 기본정보"]')), 5000);

        // 단지정보 버튼 클릭
        // let menu = await chrome.findElement(By.css('#nav > ul:nth-child(2) > li:nth-child(1) > a:nth-child(1)'));
        let menu = await chrome.findElement(By.xpath('//a[@title="단지정보"]'));
        await chrome.actions().move({origin: menu}).click().perform();

        // 우리단지 기본정보 버튼 출력
        menu = await chrome.findElement(By.xpath('//a[@title="우리단지 기본정보"]'));
        await chrome.actions().move({origin: menu}).click().perform();
        await sleep(1000);

        // -------------------------
        // 검색할 아파트를 변수로 선언
        let syear = '2023년';
        let smonth = '01월';
        let sido = '서울특별시';
        let gugun = '강남구';
        let dong = '삼성동';
        let apt = '아이파크삼성동';

        // 검색년도 값 설정
        let select = await chrome.findElement(By.name('searchYYYY'));
        await new Select(select).selectByVisibleText(syear);
        await sleep(500);

        // 검색월 값 설정
        select = await chrome.findElement(By.name('searchMM'));
        await new Select(select).selectByVisibleText(smonth);
        await sleep(500);

        // 검색시도 값 설정
        select = await chrome.findElement(By.name('combo_SIDO'));
        await new Select(select).selectByVisibleText(sido);
        await sleep(500);

        // 검색구군 값 설정
        select = await chrome.findElement(By.name('combo_SGG'));
        await new Select(select).selectByVisibleText(gugun);
        await sleep(500);

        // 검색동 값 설정
        select = await chrome.findElement(By.name('combo_EMD'));
        await new Select(select).selectByVisibleText(dong);
        await sleep(500);

        // 검색결과 출력 - 아파트명, 주소
        let apts = await chrome.findElements(By.css('.aptS_rLName'));
        let aptaddrs = await chrome.findElements(By.css('.aptS_rLAdd'));

        for (let apt of apts) {   // 아파트 이름
            console.log(await apt.getAttribute('textContent'));
        }

        for (let addr of aptaddrs) {   // 아파트 주소
            console.log(await addr.getAttribute('textContent'));
        }
        await sleep(1500);

        // 아이파크 삼성동 항목을 찾아 인덱스값 추출
        let idx = 0;
        for (let val of apts) {
            console.log(`${idx++} ${val.getAttribute('textContent')}`);
            if (await val.getAttribute('textContent') === apt) break;
        }

        // 추출한 인덱스값을 이용해서 해당 항목 직접 클릭
        menu = await chrome.findElement(By.css(`.mCSB_container ul li:nth-child(${idx}) a`));
        await chrome.actions().move({origin: menu}).click().perform();

        // await chrome.executeScript('arguments[0].click();', apts[--idx]);
        await sleep(1500);

        // -------------------------
        // 관리시설정보 클릭
        menu = await chrome.findElement(By.css('.lnbNav > li:nth-child(3) > a:nth-child(1)'));
        await chrome.actions().move({origin: menu}).click().perform();

        // 지상/지하 주차장 대수 추출
        let pcnt = await chrome.findElement(By.css('#kaptd_pcnt')).getText();
        let pcntu = await chrome.findElement(By.css('#kaptd_pcntu')).getText();
        let tpcnt = await chrome.findElement(By.css('#kaptd_total_pcnt')).getText();

        console.log(`지상 : ${pcnt}, 지하 : ${pcntu}, 총 : ${tpcnt}`);

    } catch (ex) {
        console.log(ex)
    } finally {
        await chrome.sleep(3000);
        await chrome.quit();
    }
}

// 일정 시간 셀레니엄이 대기하도록 만드는 함수
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
// promise 객체는 비동기 작업이 맞이할 미래의 완료 또는 실패와 그 결과 값을 나타냄

main();