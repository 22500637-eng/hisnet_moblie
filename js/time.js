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