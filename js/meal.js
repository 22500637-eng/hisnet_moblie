const f=document.forms[0];
const h=f.home;
const m=f.meal;
const t=f.time;
const l=f.lab;

f.addEventListener("submit",(e)=>{
    e.preventDefault();
})

h.addEventListener("click", () => {
    location.href ='hisnet.html';
});

m.addEventListener("click", () => {
    location.href = 'meal.html';
});

t.addEventListener("click", () => {
    location.href = 'time.html';
});

l.addEventListener("click", () => {
    location.href = 'lab.html';
});

// 탭 버튼 선택
const tabs = document.querySelectorAll('.tab');
// 식당별 표 선택 (data-cafe 속성 사용)
const tables = document.querySelectorAll('.menu-table');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const cafe = tab.dataset.cafe; // 클릭한 탭의 식당 종류

    // 1) 탭 active 클래스 갱신
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // 2) 모든 표 숨기고 선택한 식당 표만 보이기
    tables.forEach(table => {
      if (table.dataset.cafe === cafe) {
        table.hidden = false;
      } else {
        table.hidden = true;
      }
    });
  });
});