// 導入按鈕功能
//import { deleteRow, insertRow } from './button.js';
// 導入 xQuo 函數
//import { xQuo } from './xQuo.js';

// 主應用邏輯
(function () {
    class DataTable {
        constructor(tableElement) {
            this.table = tableElement;
            this.activeCell = null;
            this.numberInput = document.getElementById('numberInput');
            this.initializeTable();
            this.setupEventListeners();
        }

        initializeTable() {
            const tbody = this.table.querySelector('tbody');
            tbody.innerHTML = '';
            for (let i = 1; i <= 20; i++) {
                this.addNewRow(tbody);
            }
        }

        addNewRow(tbody) {
            const row = tbody.insertRow();
            for (let j = 0; j < 16; j++) {
                const cell = row.insertCell();
                if (j === 0) {
                    cell.textContent = tbody.rows.length;
                } else {
                    this.setupCell(cell, j);
                }
            }
        }

        setupCell(cell, columnIndex) {
            if (columnIndex === 3 || columnIndex === 4 || columnIndex === 5) {
                cell.classList.add('button-cell');
                cell.setAttribute('tabindex', '0');
                cell.setAttribute('role', 'button');
                cell.setAttribute('aria-label', `${['BO', 'BO2', 'SN'][columnIndex - 3]} 按鈕`);
            } else if (columnIndex === 6) {
                cell.classList.add('over-cell');
                cell.setAttribute('tabindex', '0');
                cell.setAttribute('role', 'button');
                cell.setAttribute('aria-label', 'over 按鈕');
            } else if (columnIndex === 7) {
                cell.classList.add('io-cell');
                cell.setAttribute('tabindex', '0');
                cell.setAttribute('role', 'button');
                cell.setAttribute('aria-label', 'I/O 按鈕');
            } else if (columnIndex === 8) {
                cell.classList.add('lr-cell');
                cell.setAttribute('tabindex', '0');
                cell.setAttribute('role', 'button');
                cell.setAttribute('aria-label', 'L/R 按鈕');
            } else if (columnIndex === 9) {
                cell.classList.add('chain-cell');
                cell.setAttribute('tabindex', '0');
            } else if (columnIndex === 10 || columnIndex === 11 || columnIndex === 12) {
                cell.classList.add('clickable-cell');
                cell.setAttribute('tabindex', '0');
                cell.setAttribute('role', 'button');
                cell.setAttribute('aria-label', `${['bdrive', 'dbket', 'motor'][columnIndex - 10]} 按鈕`);
            } else {
                cell.setAttribute('tabindex', '0');
            }
        }

        setupEventListeners() {
            this.table.addEventListener('click', (e) => this.handleTableClick(e));
            this.table.addEventListener('focusin', (e) => this.handleTableFocusIn(e));
            this.table.addEventListener('keydown', (e) => this.handleTableKeyDown(e));
        }

        handleTableClick(e) {
            if (e.target.matches('.round-button')) {
                this.handleRoundButtonClick(e.target);
            } else if (e.target.matches('.over-cell, .io-cell, .lr-cell')) {
                this.handleSpecialCellClick(e.target);
            } else if (e.target.matches('.chain-cell')) {
                this.handleChainCellClick(e.target);
            } else if (e.target.matches('.clickable-cell')) {
                this.handleClickableCell(e.target);
            }
        }

        handleTableFocusIn(e) {
            if (e.target.cellIndex > 0) {
                this.setActiveCell(e.target);
            }
        }

        handleTableKeyDown(e) {
            if (e.target.cellIndex > 0) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleInput('Enter');

                    const currentRow = e.target.closest('tr');
                    const currentRowIndex = currentRow.rowIndex;
                    const wCell = currentRow.cells[1];
                    const hCell = currentRow.cells[2];

                    if (currentRowIndex === this.table.rows.length - 1 &&
                        isValidInput(wCell.textContent) &&
                        isValidInput(hCell.textContent)) {
                        this.addNewRow(this.table.querySelector('tbody'));
                        this.setActiveCell(this.table.rows[currentRowIndex + 1].cells[1]);
                    }
                } else if (e.key >= '0' && e.key <= '9' && this.numberInput.value.length < 4) {
                    this.numberInput.value += e.key;
                    validateInput();
                }
            }
        }

        handleRoundButtonClick(button) {
            const row = button.closest('tr');
            const columnIndex = button.closest('td, th').cellIndex;
            const columnType = ['BO', 'BO2', 'SN'][columnIndex - 3];

            ['BO', 'BO2', 'SN'].forEach(type => {
                if (type !== columnType) {
                    const otherColumnIndex = ['BO', 'BO2', 'SN'].indexOf(type) + 3;
                    const otherButton = row.cells[otherColumnIndex].querySelector('.round-button');
                    if (otherButton) {
                        otherButton.classList.remove('active');
                        otherButton.setAttribute('aria-pressed', 'false');
                    }
                }
            });

            button.classList.toggle('active');
            button.setAttribute('aria-pressed', button.classList.contains('active'));
            this.updatePrices();
        }

        handleSpecialCellClick(cell) {
            const row = cell.closest('tr');
            const hCell = row.cells[2];
            if (hCell.textContent) {
                if (cell.classList.contains('over-cell')) {
                    cell.textContent = cell.textContent === 'O' ? '' : 'O';
                    cell.setAttribute('aria-label', cell.textContent === 'O' ? 'over 已啟用' : 'over 未啟用');
                } else if (cell.classList.contains('io-cell')) {
                    cell.textContent = cell.textContent === 'IN' ? 'OUT' : 'IN';
                    cell.setAttribute('aria-label', `I/O 設置為 ${cell.textContent}`);
                } else if (cell.classList.contains('lr-cell')) {
                    cell.textContent = cell.textContent === 'R' ? 'L' : 'R';
                    cell.setAttribute('aria-label', `L/R 設置為 ${cell.textContent}`);
                }
            }
        }

        handleChainCellClick(cell) {
            const row = cell.closest('tr');
            const hCell = row.cells[2];
            if (hCell.textContent) {
                this.setActiveCell(cell);
                this.numberInput.value = cell.textContent;
                this.numberInput.focus();
            }
        }

        handleClickableCell(cell) {
            const row = cell.closest('tr');
            const hCell = row.cells[2];
            if (hCell.textContent) {
                cell.textContent = cell.textContent === 'Yes' ? '' : 'Yes';
                cell.setAttribute('aria-pressed', cell.textContent === 'Yes');
            }
        }

        setActiveCell(cell) {
            if (this.activeCell) {
                this.activeCell.classList.remove('active-cell');
                this.activeCell.classList.remove('error');
                this.activeCell.classList.remove('success');
                this.activeCell.classList.remove('invalid-input');
            }
            this.activeCell = cell;
            this.activeCell.classList.add('active-cell');
            this.numberInput.value = this.activeCell.textContent;
            this.numberInput.style.backgroundColor = '';
            inputError.textContent = '';
            this.numberInput.focus();
        }

        updatePrices() {
            const rows = this.table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const width = parseFloat(row.cells[1].textContent);
                const height = parseFloat(row.cells[2].textContent);
                if (isValidInput(width) && isValidInput(height)) {
                    let price;
                    try {
                        if (row.cells[3].querySelector('.round-button.active')) {
                            price = memoFindPrice(width, height, priceDatabase.sunsetTable);
                        } else if (row.cells[4].querySelector('.round-button.active')) {
                            price = memoFindPrice(width, height, priceDatabase.wilsonTable);
                        } else if (row.cells[5].querySelector('.round-button.active')) {
                            price = memoFindPrice(width, height, priceDatabase.univiewTable);
                        } else {
                            price = '';
                        }
                    } catch (error) {
                        console.error('Error calculating price:', error);
                        price = 'Error';
                    }

                    const priceCell = row.cells[14];
                    if (typeof price === 'number') {
                        priceCell.textContent = price.toLocaleString();
                        priceCell.classList.remove('error');
                    } else {
                        priceCell.textContent = price;
                        if (price === 'Error') {
                            priceCell.classList.add('error');
                        } else {
                            priceCell.classList.remove('error');
                        }
                    }
                }
            });
        }
    }

    const dataTable = new DataTable(document.getElementById('dataTable'));
    window.dataTable = dataTable; // 將 dataTable 暴露給全局作用域

    const memoFindPrice = (() => {
        const cache = new Map();
        return (width, height, table) => {
            const key = `${width}-${height}-${table}`;
            if (cache.has(key)) {
                return cache.get(key);
            }
            const widthResult = priceDatabase.findNextRange(width, priceDatabase.widthRanges);
            const heightResult = priceDatabase.findNextRange(height, priceDatabase.heightRanges);

            if (!widthResult || !heightResult) {
                return "not found, input smaller value";
            }

            const { index: widthIndex } = widthResult;
            const { index: heightIndex } = heightResult;

            const result = table?.[heightIndex]?.[widthIndex] ?? "not found";
            cache.set(key, result);
            return result;
        };
    })();

    const numberInput = document.getElementById('numberInput');
    const inputError = document.getElementById('inputError');
    const numpadButtons = document.querySelectorAll('.numpad button');
    const functionButtons = document.querySelectorAll('.function-keys-container button');
    const errorSound = document.getElementById('errorSound');

    const isValidInput = (value, min = 250, max = 3500) => {
        if (value === '') return true;
        const num = parseInt(value);
        return !isNaN(num) && num >= min && num <= max;
    };

    const updateTargetCell = (value) => {
        if (dataTable.activeCell) {
            const isChainCell = dataTable.activeCell.cellIndex === 9;
            const minValue = isChainCell ? 250 : 250;
            const maxValue = isChainCell ? 3000 : 3500;

            if (value === '' || isValidInput(value, minValue, maxValue)) {
                if (dataTable.activeCell.cellIndex === 1 || dataTable.activeCell.cellIndex === 2) {
                    if (value === '') {
                        inputError.textContent = 'no blank left in W or H ';
                        dataTable.activeCell.classList.add('invalid-input');
                        return;
                    }
                }

                dataTable.activeCell.textContent = value;
                dataTable.activeCell.classList.remove('error', 'invalid-input');
                dataTable.activeCell.classList.add('success');
                numberInput.value = '';
                numberInput.style.backgroundColor = '';
                inputError.textContent = '';
                highlightRow(dataTable.activeCell.parentElement.rowIndex);


                if (dataTable.activeCell.cellIndex === 2) {
                    const row = dataTable.activeCell.parentElement;
                    const wCell = row.cells[1];
                    if (wCell.textContent) {
                        createButtonsAndSetDefaults(row);
                    } else {
                        inputError.textContent = 'W is blank ';
                        wCell.classList.add('invalid-input');
                        dataTable.setActiveCell(wCell);
                        numberInput.focus();
                        return;
                    }
                } else if (dataTable.activeCell.cellIndex === 1) {
                    const row = dataTable.activeCell.parentElement;
                    const hCell = row.cells[2];
                    if (hCell.textContent) {
                        createButtonsAndSetDefaults(row);
                    }
                }


                if (dataTable.activeCell.cellIndex === 2) {
                    const row = dataTable.activeCell.parentElement;
                    const wCell = row.cells[1];
                    if (!wCell.textContent) {
                        wCell.classList.add('invalid-input');
                        dataTable.setActiveCell(wCell);
                        inputError.textContent = 'W is blank';
                        numberInput.focus();
                        return;
                    }
                }


                const currentRow = dataTable.activeCell.closest('tr');
                const currentRowIndex = currentRow.rowIndex;
                const wCell = currentRow.cells[1];
                const hCell = currentRow.cells[2];

                if (currentRowIndex === dataTable.table.rows.length - 1 &&
                    isValidInput(wCell.textContent) &&
                    isValidInput(hCell.textContent)) {
                    dataTable.addNewRow(dataTable.table.querySelector('tbody'));
                }

                if (dataTable.activeCell.parentElement.rowIndex < dataTable.table.rows.length - 1) {
                    const nextRow = dataTable.activeCell.parentElement.nextElementSibling;
                    const nextCell = nextRow.cells[dataTable.activeCell.cellIndex];
                    dataTable.setActiveCell(nextCell);
                }
                scrollToRow(dataTable.activeCell.parentElement.rowIndex - 1);
            } else if (value !== '') {
                dataTable.activeCell.textContent = '';
                dataTable.activeCell.classList.add('error', 'invalid-input');
                numberInput.style.backgroundColor = 'var(--error-color)';
                inputError.textContent = isChainCell ? 'Input 250-3000' : 'input 250-3500';
            } else {
                if (dataTable.activeCell.cellIndex === 2) {
                    const row = dataTable.activeCell.parentElement;
                    for (let i = 3; i <= 5; i++) {
                        const button = row.cells[i].querySelector('.round-button');
                        if (button) {
                            row.cells[i].removeChild(button);
                        }
                    }
                    row.cells[7].textContent = '';
                    row.cells[8].textContent = '';
                    row.cells[9].removeAttribute('contenteditable');
                    row.cells[9].classList.remove('editable');

                    // Disable bdrive, dbket, and motor cells
                    for (let i = 10; i <= 12; i++) {
                        row.cells[i].classList.remove('clickable');
                        row.cells[i].textContent = '';
                    }
                }
            }
        }
    };

    const createButtonsAndSetDefaults = (row) => {
        for (let i = 3; i <= 5; i++) {
            if (!row.cells[i].querySelector('.round-button')) {
                const button = document.createElement('div');
                button.className = 'round-button';
                button.dataset.type = ['BO', 'BO2', 'SN'][i - 3];
                button.setAttribute('role', 'button');
                button.setAttribute('aria-label', `${['BO', 'BO2', 'SN'][i - 3]} 切換`);
                button.setAttribute('tabindex', '0');
                row.cells[i].appendChild(button);
            }
        }
        row.cells[7].textContent = 'IN';
        row.cells[8].textContent = 'R';
        row.cells[9].setAttribute('contenteditable', 'true');
        row.cells[9].classList.add('editable');

        // Enable bdrive, dbket, and motor cells
        for (let i = 10; i <= 12; i++) {
            row.cells[i].classList.add('clickable');
        }
    };

    const highlightRow = (rowIndex) => {
        const rows = dataTable.table.querySelectorAll('tbody tr');
        rows.forEach(row => row.classList.remove('highlight'));
        if (rowIndex > 0 && rowIndex <= dataTable.table.rows.length - 1) {
            rows[rowIndex - 1].classList.add('highlight');
        }
    };

    const scrollToRow = (rowIndex) => {
        requestAnimationFrame(() => {
            if (rowIndex >= 1 && rowIndex < dataTable.table.rows.length) {
                const rowToScroll = dataTable.table.rows[rowIndex];
                rowToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    };

    const handleInput = (value) => {
        if (value === 'Delete') {
            numberInput.value = numberInput.value.slice(0, -1);
        } else if (value === 'Enter') {
            validateInput();
            updateTargetCell(numberInput.value);
        } else if (numberInput.value.length < 4) {
            numberInput.value += value;
        }
        validateInput();
    };

    const validateInput = () => {
        if (!dataTable.activeCell) return;
        if (numberInput.value === '') {
            numberInput.style.backgroundColor = '';
            inputError.textContent = '';
            return;
        }
        const isChainCell = dataTable.activeCell.cellIndex === 9;
        const minValue = isChainCell ? 250 : 250;
        const maxValue = isChainCell ? 3000 : 3500;
        if (isValidInput(numberInput.value, minValue, maxValue)) {
            numberInput.style.backgroundColor = '';
            inputError.textContent = '';
        } else {
            numberInput.style.backgroundColor = 'var(--error-color)';
            inputError.textContent = isChainCell ? 'input 250-3000' : 'input 250-3500';
        }
    };

    numpadButtons.forEach(button => {
        button.addEventListener('click', () => {
            handleInput(button.textContent);
        });
    });

    functionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            if (value === 'Reset') {
                // 新增：檢查並刪除 totalprice 表格
                const existingTotalPriceTable = document.getElementById('totalprice');
                if (existingTotalPriceTable) {
                    existingTotalPriceTable.remove();
                }

                // 原有的重置功能
                dataTable.initializeTable();
                numberInput.value = '';
                inputError.textContent = '';
                dataTable.activeCell = null;
                dataTable.setActiveCell(dataTable.table.rows[1].cells[1]);
                numberInput.focus();
            } else if (value === 'W') {
                dataTable.setActiveCell(dataTable.table.rows[1].cells[1]);
                highlightRow(1);
            } else if (value === 'H') {
                dataTable.setActiveCell(dataTable.table.rows[1].cells[2]);
                highlightRow(1);
                dataTable.table.parentElement.scrollTop = 0;
            } else if (value === 'Finish') {
                if (typeof dataTable !== 'undefined' && dataTable !== null) {
                    window.finishAndSubmit(dataTable); //finishAndSubmit(dataTable);另一個在701行
                } else {
                    console.error('dataTable is not defined');
                    alert('An error occurred. Please try again.');
                }
            } else if (value === 'Chk Price') {
                checkPrice();
            }
        });
    });

    numberInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleInput('Enter');
        } else if (e.key === 'Backspace') {
            handleInput('Delete');
        }
    });

    document.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            navigateTable(e.key);
        }
    });

    const navigateTable = (key) => {
        if (!dataTable.activeCell) {
            dataTable.setActiveCell(dataTable.table.rows[1].cells[1]);
            return;
        }

        const currentRow = dataTable.activeCell.parentElement.rowIndex;
        const currentCol = dataTable.activeCell.cellIndex;

        let newRow = currentRow;
        let newCol = currentCol;

        switch (key) {
            case 'ArrowUp':
                newRow = Math.max(1, currentRow - 1);
                break;
            case 'ArrowDown':
                newRow = Math.min(dataTable.table.rows.length - 1, currentRow + 1);
                break;
            case 'ArrowLeft':
                newCol = Math.max(1, currentCol - 1);
                break;
            case 'ArrowRight':
                newCol = Math.min(15, currentCol + 1);
                break;
        }

        const newCell = dataTable.table.rows[newRow].cells[newCol];
        dataTable.setActiveCell(newCell);
        scrollToRow(newRow - 1);
        numberInput.focus();
    };

    window.addEventListener('load', () => {
        dataTable.initializeTable();
        numberInput.focus();
        dataTable.setActiveCell(dataTable.table.rows[1].cells[1]);
        highlightRow(1);
    });

    const updateColumnState = (columnType) => {
        const headers = {
            'BO': dataTable.table.querySelector('th.bo-header'),
            'BO2': dataTable.table.querySelector('th.bo2-header'),
            'SN': dataTable.table.querySelector('th.sn-header'),
            'OVER': dataTable.table.querySelector('th.over-header'),
            'IO': dataTable.table.querySelector('th.io-header'),
            'LR': dataTable.table.querySelector('th.lr-header'),
            'BDRIVE': dataTable.table.querySelector('th.bdrive-header'),
            'DBKET': dataTable.table.querySelector('th.dbket-header'),
            'MOTOR': dataTable.table.querySelector('th.motor-header')
        };

        const isActive = headers[columnType].classList.toggle('active');

        Object.keys(headers).forEach(type => {
            if (type !== columnType) {
                headers[type].classList.remove('active');
            }
        });

        const rows = dataTable.table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const hCell = row.cells[2];
            if (hCell.textContent && isValidInput(hCell.textContent)) {
                if (columnType === 'OVER') {
                    const overCell = row.cells[6];
                    overCell.textContent = isActive ? 'O' : '';
                    overCell.style.fontWeight = isActive ? 'bold' : 'normal';
                    overCell.style.textAlign = 'center';
                } else if (columnType === 'IO') {
                    const ioCell = row.cells[7];
                    ioCell.textContent = isActive ? 'OUT' : 'IN';
                } else if (columnType === 'LR') {
                    const lrCell = row.cells[8];
                    lrCell.textContent = isActive ? 'L' : 'R';
                } else if (['BDRIVE', 'DBKET', 'MOTOR'].includes(columnType)) {
                    const cellIndex = ['BDRIVE', 'DBKET', 'MOTOR'].indexOf(columnType) + 10;
                    const cell = row.cells[cellIndex];
                    cell.textContent = isActive ? 'Yes' : '';
                } else {
                    const cellIndex = ['BO', 'BO2', 'SN'].indexOf(columnType) + 3;
                    const cell = row.cells[cellIndex];
                    const button = cell.querySelector('.round-button');
                    if (button) {
                        if (isActive) {
                            button.classList.add('active');
                            button.setAttribute('aria-pressed', 'true');
                            ['BO', 'BO2', 'SN'].forEach(type => {
                                if (type !== columnType) {
                                    const otherCellIndex = ['BO', 'BO2', 'SN'].indexOf(type) + 3;
                                    const otherButton = row.cells[otherCellIndex].querySelector('.round-button');
                                    if (otherButton) {
                                        otherButton.classList.remove('active');
                                        otherButton.setAttribute('aria-pressed', 'false');
                                    }
                                }
                            });
                        } else {
                            button.classList.remove('active');
                            button.setAttribute('aria-pressed', 'false');
                        }
                    }
                }
            }
        });

        if (['BO', 'BO2', 'SN'].includes(columnType)) {
            dataTable.updatePrices();
        }
    };

    ['bo-header', 'bo2-header', 'sn-header', 'over-header', 'io-header', 'lr-header', 'bdrive-header', 'dbket-header', 'motor-header'].forEach(headerClass => {
        const header = dataTable.table.querySelector(`th.${headerClass}`);
        header.addEventListener('click', () => {
            updateColumnState(headerClass.split('-')[0].toUpperCase());
        });
    });

    const checkPrice = () => {
        console.log('Check Price button clicked');
        dataTable.updatePrices();
        alert('價格已更新');
    };

    const saveData = () => {
        const data = [];
        const rows = dataTable.table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const rowData = Array.from(row.cells).map(cell => cell.textContent);
            data.push(rowData);
        });
        localStorage.setItem('tableData', JSON.stringify(data));
    };

    const loadData = () => {
        const savedData = localStorage.getItem('tableData');
        if (savedData) {
            const data = JSON.parse(savedData);
            const tbody = dataTable.table.querySelector('tbody');
            tbody.innerHTML = '';
            data.forEach(rowData => {
                const row = tbody.insertRow();
                rowData.forEach((cellData, index) => {
                    const cell = row.insertCell();
                    cell.textContent = cellData;
                    if (index === 3 || index === 4 || index === 5) {
                        cell.classList.add('button-cell');
                        cell.setAttribute('tabindex', '0');
                        cell.setAttribute('role', 'button');
                        cell.setAttribute('aria-label', `${['BO', 'BO2', 'SN'][index - 3]} 按鈕`);
                    } else if (index === 6) {
                        cell.classList.add('over-cell');
                        cell.setAttribute('tabindex', '0');
                        cell.setAttribute('role', 'button');
                        cell.setAttribute('aria-label', 'over 按鈕');
                    } else if (index === 7) {
                        cell.classList.add('io-cell');
                        cell.setAttribute('tabindex', '0');
                        cell.setAttribute('role', 'button');
                        cell.setAttribute('aria-label', 'I/O 按鈕');
                    } else if (index === 8) {
                        cell.classList.add('lr-cell');
                        cell.setAttribute('tabindex', '0');
                        cell.setAttribute('role', 'button');
                        cell.setAttribute('aria-label', 'L/R 按鈕');
                    } else if (index === 9) {
                        cell.classList.add('chain-cell');
                        cell.setAttribute('tabindex', '0');
                    } else if (index === 10 || index === 11 || index === 12) {
                        cell.classList.add('clickable-cell');
                        cell.setAttribute('tabindex', '0');
                        cell.setAttribute('role', 'button');
                        cell.setAttribute('aria-label', `${['bdrive', 'dbket', 'motor'][index - 10]} 按鈕`);
                    } else {
                        cell.setAttribute('tabindex', '0');
                    }
                });
            });
        }
    };

    setInterval(saveData, 30000);

    document.getElementById('delRowBtn').addEventListener('click', () => {
        const rowNumber = prompt("Which Row do you want to delete?");
        ButtonModule.deleteRow(dataTable, rowNumber);
    });

    document.getElementById('insertRowBtn').addEventListener('click', () => {
        const rowNumber = prompt("Below which Row do you want to insert a new row?");
        ButtonModule.insertRow(dataTable, rowNumber);
    });

    // Make sure to expose necessary functions to the global scope
    const setDataTable = window.setDataTable; //window.setDataTable = setDataTable;另一個在line 473
    window.finishAndSubmit = finishAndSubmit;
    window.totalpricetablesetup = totalpricetablesetup;
    //window.deleteRow = deleteRow;
    //window.insertRow = insertRow;
    document.addEventListener('DOMContentLoaded', function () {
        // 獲取 xQuo 按鈕元素
        const xQuoButton = document.getElementById('xQuoButton');
        // 如果按鈕存在，為其添加點擊事件監聽器
        if (xQuoButton) {
            xQuoButton.addEventListener('click', xQuo);
        } else {
            console.error('xQuo button not found in the document');
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        // 獲取 xOdr 按鈕元素
        const xOrderButton = document.getElementById('xOrderButton');
        // 如果按鈕存在，為其添加點擊事件監聽器
        if (xOrderButton) {
            xOrderButton.addEventListener('click', xOrder);
        } else {
            console.error('xOrder button not found in the document');
        }
    });

})();

