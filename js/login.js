let name;
let studentNum;

while (true) {
    name = prompt("이름을 입력하세요:");
    studentNum = prompt("학번을 입력하세요:");

    if (studentNum.length === 8) {
        alert(`${name}(${studentNum})님 환영합니다!`);
        break;
    } else {
        alert("#입력오류 재입력하세요!");
    }
}

location.href ='hisnet.html';
