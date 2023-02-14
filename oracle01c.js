// zipcode2013 테이블에서 서울시 강남구에 있는 모든 동을 조회해서 출력하세요

const oracledb = require('oracledb');

async function main() {

    // const sql = `SELECT DISTINCT DONG
    //              FROM zipcode2013
    //              WHERE SIDO = :1 AND GUGUN = :2
    //              ORDER BY DONG`;
    const sql = `SELECT DISTINCT DONG 
                 FROM zipcode2013
                 WHERE SIDO = :SIDO AND GUGUN = :GUGUN
                 ORDER BY DONG`;
    let params = {SIDO: '서울', GUGUN: '강남구'};
    let options = {
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT
    };   // oracle db를 위한 옵션 정의

    let conn = null;   // 디비 연결 객체

    try {
        // 오라클 인스턴스 클라이언트 초기화
        oracledb.initOracleClient({libDir: 'C:/Java/instantclient_19_17'});

        // 오라클 접속 정보를 이용해서 오라클 연결 객체 하나 생성
        conn = await oracledb.getConnection({
            user: 'bigdata', password: 'bigdata',
            connectionString: '3.36.53.178'
        });
        console.log('오라클 데이터베이스 접속 성공!!');

        // sql문을 실행하고 결과를 받아옴
        let result = await conn.execute(sql, params, options);

        // 실행결과를 결과집합 객체로 변환
        let rs = result.resultSet;

        // 결과집합 객체의 각 요소를 순회하면서 내용 출력
        let row = null;
        while (row = await rs.getRow()) {   // outFormat 설정 필요!
            console.log(row.DONG)
        }

        // 작업이 끝나면 결과집합 객체를 닫음
        rs.close();

    } catch (ex) {
        console.error(ex);
    } finally {
        if (conn) {
            try {
                await conn.close();
                console.log('오라클 접속 해제 성공!!');
            } catch (ex) {
                console.error(ex);
            }

        }
    }
}

main();