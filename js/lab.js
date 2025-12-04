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


//상상랩 예약//
const btn1 = document.querySelector('#btn1'); 
const btn2 = document.querySelector('#btn2'); 
const btn3 = document.querySelector('#btn3'); 

const tables = document.querySelectorAll('.labtable'); 
const reservationBtn = document.querySelector('#rbtn'); 
const reservationMessage = document.querySelector('#reservation-message');
const reservationListBody = document.querySelector('#reservation-list tbody'); 

let selectedCells = []; 
let currentLab = '01'; 
let reservations = {}; 


tables[1].style.display = "none";
tables[2].style.display = "none";





function getCellDate(cell) {
    const table = cell.closest('table'); 
    const cellIndex = cell.cellIndex; 
    const headerCell = table.querySelector('thead th:nth-child(' + (cellIndex + 1) + ')'); 
    
   

    return headerCell.textContent.split('\n')[0];
}



function clearSelectedCells() {
    selectedCells.forEach((cell) => {
        cell.classList.remove('selected'); 
    });
    selectedCells = [];
}



function getCellEndTime(cell) {
    const timeSlot = cell.parentNode.querySelector('th').textContent; 
   

    return timeSlot.split('-')[1];
}


function getCellStartTime(cell) {
    const timeSlot = cell.parentNode.querySelector('th').textContent;
    return timeSlot.split('-')[0];
}



function switchTable(index, labNumber) {
    tables.forEach((table, i) => {
        table.style.display = (i === index) ? 'table' : 'none'; 
    });
    currentLab = labNumber;
    reservationMessage.textContent = '상상랩 예약 대기 중입니다.'; 
    clearSelectedCells(); 
}



function handleCellClick(event) {
    const cell = event.target; 
    if (cell.classList.contains('reserved')) return; 
    
    const clickedDate = getCellDate(cell); 

    if (cell.classList.contains('selected')) { 
        cell.classList.remove('selected'); 
        selectedCells = selectedCells.filter(c => c !== cell); 
        
    } else {
        if (selectedCells.length > 0) {
            const firstSelectedDate = getCellDate(selectedCells[0]); 
            if (firstSelectedDate !== clickedDate) { 
                alert('하나의 날짜 내에서만 시간을 선택해 주세요.'); 
                return;
            }
        }
        cell.classList.add('selected'); 
        selectedCells.push(cell); 
    }
}



function handleReservation() {
    if (selectedCells.length === 0) { 
        alert('예약할 시간대를 선택해 주세요.');
        return;
    }
    
    const labNumber = currentLab; 
    const allReservedTimes = []; 
    
    
    selectedCells.sort((a, b) => a.parentNode.rowIndex - b.parentNode.rowIndex); 

    const dateText = getCellDate(selectedCells[0]); 
    let currentBlock = [];
    let reservationBlocks = [];


    for (let i = 0; i < selectedCells.length; i++) {
        const cell = selectedCells[i];
        
        if (currentBlock.length === 0) {
            currentBlock.push(cell);
        } else { 
            const prevCell = currentBlock[currentBlock.length - 1];
            
           
            const prevEndTime = getCellEndTime(prevCell);
            const currentStartTime = getCellStartTime(cell);
            
           
            if (prevEndTime === currentStartTime.replace(':01', ':00')) { 
                currentBlock.push(cell);
            } else {
                
                reservationBlocks.push(currentBlock);
                currentBlock = [cell];
            }
        }
    }

    if (currentBlock.length > 0) {
        reservationBlocks.push(currentBlock);
    }

    
    reservationBlocks.forEach(block => { 
        const firstCell = block[0];
        const lastCell = block[block.length - 1];
        
        
        const startTime = getCellStartTime(firstCell); 
        const endTime = getCellEndTime(lastCell);     
        const combinedTimeRange = `${startTime}-${endTime}`; 
        

        const reservationId = `Lab${labNumber}_${dateText}_${startTime}_${endTime}_${Math.random()}`; 
        
    
        reservations[reservationId] = {
            date: dateText,
            time: combinedTimeRange, 
            lab: `상상랩 ${labNumber}`,
         
            cells: block.map(cell => ({ 
                tableId: cell.closest('table').id, 
                rowIndex: cell.parentNode.rowIndex, 
                cellIndex: cell.cellIndex
            }))
        };
        
        
        block.forEach(cell => {
            cell.classList.remove('selected');
            cell.classList.add('reserved');
        });

        allReservedTimes.push(combinedTimeRange);
    });

    
    selectedCells = []; 
    

    const timeRangeText = allReservedTimes.join(', '); 
    reservationMessage.textContent = `${dateText} ${timeRangeText}에 상상랩 ${labNumber}가 예약되었습니다.`;


    updateReservationList();
}


function handleCancel(id) {
    if (confirm('예약을 취소하겠습니까?')) {
        const info = reservations[id];

        
        info.cells.forEach(cellInfo => {
            const targetTable = document.querySelector(`#${cellInfo.tableId}`); 
            const cellToReset = targetTable.rows[cellInfo.rowIndex].cells[cellInfo.cellIndex]; 
            
            if (cellToReset) {
                cellToReset.classList.remove('reserved');
                cellToReset.classList.remove('selected'); 
            }
        });

        
        delete reservations[id];

       
        updateReservationList();
        
        alert('예약이 취소되었습니다');
    }
}


function updateReservationList() {
    reservationListBody.innerHTML = ''; 

    for (const id in reservations) { 
        const info = reservations[id];
        const newRow = reservationListBody.insertRow(); 
        
        let cell = newRow.insertCell();
        cell.textContent = info.date;

        cell = newRow.insertCell();
        cell.textContent = info.time;

        cell = newRow.insertCell();
        cell.textContent = info.lab;

        
        cell = newRow.insertCell();
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '예약 취소';
        cancelButton.classList.add('cancel-btn');
        cancelButton.addEventListener('click', () => handleCancel(id)); 
        cell.appendChild(cancelButton);
    }
}




btn1.addEventListener('click', () => switchTable(0, '01'));
btn2.addEventListener('click', () => switchTable(1, '02'));
btn3.addEventListener('click', () => switchTable(2, '03'));

tables.forEach(table => {
    table.addEventListener('click', (event) => { 
        if (event.target.tagName === 'TD') { 
            handleCellClick(event);
        }
    });
});

reservationBtn.addEventListener('click', handleReservation); 

updateReservationList(); 