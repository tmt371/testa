// 使用立即執行函數表達式 (IIFE) 來避免全局變量污染
(function () {
    // 使用 WeakMap 來存儲 dataTable 對象，避免全局變量
    const dataTableMap = new WeakMap();

    // 設置 dataTable 對象的函數
    function setDataTable(table) {
        dataTableMap.set(window, table);
    }

    function getDataTable() {
        return dataTableMap.get(window);
    }

    function finishAndSubmit(dataTable) {
        console.log(dataTable);
        //const dataTable = getDataTable();
        if (!dataTable || !dataTable.table) {
            console.error('dataTable or dataTable.table is not defined');
            alert('Error, try again。');
            return;
        }

        // 檢查並移除現有的 totalprice 表格
        const existingTotalPriceTable = document.getElementById('totalprice');
        if (existingTotalPriceTable) {
            existingTotalPriceTable.remove();
        }

        // 獲取當前表格中的所有行
        const rows = Array.from(dataTable.table.querySelectorAll('tbody tr'));

        // 找到最後一個非空行的索引
        const lastNonEmptyRowIndex = findLastNonEmptyRowIndex(rows);

        // 刪除最後一個非空行之後的所有行
        deleteEmptyRows(dataTable.table, lastNonEmptyRowIndex);

        // 檢查是否有空白的價格欄位
        const emptyPriceCells = checkEmptyPriceCells(rows, lastNonEmptyRowIndex);

        // 如果存在空白的價格欄位，顯示警告並終止函數
        if (emptyPriceCells.length > 0) {
            showEmptyPriceCellWarnings(emptyPriceCells);
            return;
        }

        // 創建新的 totalprice 表格
        const newTable = createTotalPriceTable();

        // 執行 totalpricetablesetup 函數
        totalpricetablesetup(newTable);

        // 將新表格插入到原有數據表格的後面
        dataTable.table.parentNode.insertBefore(newTable, dataTable.table.nextSibling);

        // 調用 calculatePrice 函數
        calculatePrice();

        // 滾動到 total price table
        scrollToTotalPriceTable();
    }
    window.finishAndSubmit = finishAndSubmit;
    function findLastNonEmptyRowIndex(rows) {
        for (let i = rows.length - 1; i >= 0; i--) {
            const cells = Array.from(rows[i].cells).slice(1); // 排除第一列（NO列）
            if (!cells.every(cell => cell.textContent.trim() === '')) {
                return i;
            }
        }
        return -1;
    }

    function deleteEmptyRows(table, lastNonEmptyRowIndex) {
        for (let i = table.rows.length - 1; i > lastNonEmptyRowIndex + 1; i--) {
            table.deleteRow(i);
        }
    }

    function checkEmptyPriceCells(rows, lastNonEmptyRowIndex) {
        const emptyPriceCells = [];
        const PRICE_COLUMN_INDEX = 14;

        rows.slice(0, lastNonEmptyRowIndex + 1).forEach((row, index) => {
            const priceCell = row.cells[PRICE_COLUMN_INDEX];
            if (priceCell.textContent.trim() === '') {
                emptyPriceCells.push(index + 1); // 加1是因為行號從1開始
            }
        });

        return emptyPriceCells;
    }

    function showEmptyPriceCellWarnings(emptyPriceCells) {
        emptyPriceCells.forEach(index => {
            alert(`NO.${index} Row, no Price shown`);
        });
    }

    function createTotalPriceTable() {
        const newTable = document.createElement('table');
        newTable.id = 'totalprice';
        newTable.style.width = '800px';
        newTable.style.margin = '20px auto 0';
        newTable.style.marginLeft = '15px';

        for (let i = 0; i < 5; i++) {
            const row = newTable.insertRow();
            for (let j = 0; j < 8; j++) {
                const cell = row.insertCell();
                cell.style.width = '15%';
                cell.style.height = '12px';
                cell.style.border = '1px solid black';
            }
        }

        return newTable;
    }

    function scrollToTotalPriceTable() {
        const totalPriceTable = document.getElementById('totalprice');
        if (totalPriceTable) {
            totalPriceTable.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    function totalpricetablesetup(table) {
        // 填充表頭
        const headers = ['BO', 'BO2', 'SN', 'bdrive', 'dbket 10', 'motor', 'Total'];
        headers.forEach((header, index) => {
            table.rows[0].cells[index + 1].textContent = header;
        });

        // 填充第一列
        const firstColumnLabels = ['price total', 'discount', 'GST', 'Total'];
        firstColumnLabels.forEach((label, index) => {
            table.rows[index + 1].cells[0].textContent = label;
        });

        const mainTable = document.getElementById('dataTable');

        // 計算並填充 BO, BO2, SN, bdrive, dbket 10, motor 列
        const columnTotals = calculateColumnTotals(mainTable);

        // 填充總計
        fillTotalPriceTable(table, columnTotals);

        // 處理折扣率
        handleDiscount(table);
    }

    function calculateColumnTotals(mainTable) {
        const columnIndices = {
            BO: 3, BO2: 4, SN: 5, bdrive: 10, dbket: 11, motor: 12
        };
        const PRICE_COLUMN_INDEX = 14;

        const totals = Object.keys(columnIndices).reduce((acc, key) => {
            acc[key] = 0;
            return acc;
        }, {});

        Array.from(mainTable.querySelectorAll('tbody tr')).forEach(row => {
            Object.entries(columnIndices).forEach(([key, index]) => {
                if (key === 'bdrive' || key === 'dbket' || key === 'motor') {
                    if (row.cells[index].textContent.trim() === 'Yes') {
                        totals[key] += key === 'bdrive' ? 2 : (key === 'dbket' ? 10 : 160);
                    }
                } else {
                    const isActive = row.cells[index].querySelector('.round-button.active');
                    if (isActive) {
                        totals[key] += parseFloat(row.cells[PRICE_COLUMN_INDEX].textContent.replace(/,/g, '')) || 0;
                    }
                }
            });
        });

        return totals;
    }

    function fillTotalPriceTable(table, totals) {
        Object.entries(totals).forEach(([key, value], index) => {
            table.rows[1].cells[index + 1].textContent = value.toLocaleString();
        });

        const grandTotal = Object.values(totals).reduce((sum, value) => sum + value, 0);
        table.rows[1].cells[7].textContent = grandTotal.toLocaleString();
    }

    function handleDiscount(table) {
        let discountRate;
        let userInput;

        while (true) {
            const input = prompt("Input the discount rate % (0%-30%); Cancel= 0% ");
            if (input === null) {
                discountRate = 1;
                userInput = "0";
                break;
            }
            const rate = parseFloat(input);
            if (!isNaN(rate) && rate >= 0 && rate <= 30) {
                discountRate = (100 - rate) / 100;
                userInput = rate.toString();
                break;
            }
            alert("Input 0-30; Cancel = 0%");
        }

        // 將用戶輸入的折扣率顯示在表格的第一列、第一行
        const discountCell = table.rows[0].cells[0];
        discountCell.textContent = `${userInput} %`;
        discountCell.style.backgroundColor = 'yellow';

        // 計算並填充折扣、GST 和 Total
        for (let col = 1; col <= 7; col++) {
            const originalPrice = parseFloat(table.rows[1].cells[col].textContent.replace(/,/g, '')) || 0;
            const discountedPrice = originalPrice * discountRate;
            const gst = Math.round(discountedPrice * 0.1 * 100) / 100; // 四捨五入到小數點後兩位
            const total = discountedPrice + gst;

            table.rows[2].cells[col].textContent = discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            table.rows[3].cells[col].textContent = gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            table.rows[4].cells[col].textContent = total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // 計算並填充每一行的總計
        for (let row = 1; row <= 4; row++) {
            const rowTotal = Array.from(table.rows[row].cells)
                .slice(1, 7) // 僅取第 2 到第 7 列（不包含第 8 列）
                .reduce((sum, cell) => sum + (parseFloat(cell.textContent.replace(/,/g, '')) || 0), 0);
            table.rows[row].cells[7].textContent = rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    }

    // 這個函數需要在主HTML文件中實現
    function calculatePrice() {
        console.log("calculatePrice function called");
        // 在這裡實現價格計算邏輯
        // 這個函數將在未來的更新中實現
    }

    // 將這些函數設為全局可用
    window.setDataTable = setDataTable;
    window.finishAndSubmit = finishAndSubmit;
    window.totalpricetablesetup = totalpricetablesetup;
})();