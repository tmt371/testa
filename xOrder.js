function xOrder() {
    // Create a floating window
    const floatingWindow = window.open('', 'xOrderWindow', 'width=1000,height=1600');

    // Define the HTML content directly in the JavaScript
    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EZ Blinds & Shutters Quotation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .section {
            width: 20cm;
            margin: 0 auto;
        }

        .header {
            background-color: #F2F2F2;
            padding: 15px;
            display: flex;
            justify-content: space-between;
            height: 200px;
            /* 設定高度為 100px */
        }

        .header h1 {
            color: #E97132;
            margin: 0;
        }

        .company-info {
            text-align: Left;
        }

        .middle-container {
            width: 20cm;
            height: 25cm;
            border: 1px solid black;
            margin: 20px auto;
        }

    .bottom-section {
    display: flex;
    flex-direction: column;  /* 垂直排列元素 */
    justify-content: flex-start;  /* 可選，讓元素從上往下排列 */
    align-items: flex-start;  /* 可選，對齊方式設為左側 */
}



        .date-input {
            border: none;
            border-bottom: 1px solid #333;
            padding: 5px 0;
            width: 100px;
        }
    </style>
</head>

<body>
    <div class="section header">
        <div>
            <h1>Order list</h1>

            <p>Customer: <span contenteditable="true"></span></p>
            <p>Address: <span contenteditable="true"></span></p>
            <p>Phone: <span contenteditable="true"></span></p>

            <strong>Issue Date:</strong> <input type="text" class="date-input" id="issueDate">
            <strong>Due Date:</strong> <input type="text" class="date-input" id="dueDateDisplay">
        </div>
        <div class="company-info">
            <h2>Company: <span contenteditable="true"></span></h2>
            <p>Ref: <span contenteditable="true"></span></p>
            <p>email: ezblinds＠ezbns.com.au</p>

        </div>
    </div>

    <div class="section middle-container">
        <!-- Content for the middle section can be added here -->
    </div>

    <div class="section bottom-section">
    </div>
    </div>

    <script>
        document.addEventListener("DOMContentLoaded", function () {
            function formatDate(date) {
                var day = date.getDate();
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
                return \`\${day < 10 ? '0' + day : day}/\${month < 10 ? '0' + month : month}/\${year}\`;
            }

            var issueDateInput = document.getElementById("issueDate");
            var dueDateDisplay = document.getElementById("dueDateDisplay");

            var currentDate = new Date();
            issueDateInput.value = formatDate(currentDate);

            var dueDate = new Date(currentDate);
            dueDate.setDate(dueDate.getDate() + 14);
            dueDateDisplay.value = formatDate(dueDate);

            issueDateInput.addEventListener("input", function () {
                var parts = issueDateInput.value.split('/');
                if (parts.length === 3) {
                    var day = parseInt(parts[0], 10);
                    var month = parseInt(parts[1], 10) - 1;
                    var year = parseInt(parts[2], 10);
                    var newIssueDate = new Date(year, month, day);
                    if (!isNaN(newIssueDate)) {
                        var newDueDate = new Date(newIssueDate);
                        newDueDate.setDate(newDueDate.getDate() + 14);
                        dueDateDisplay.value = formatDate(newDueDate);
                    }
                }
            });
        });
    </script>
</body>

</html>    `;

    // Set the HTML content of the floating window
    floatingWindow.document.open();
    floatingWindow.document.write(htmlContent);
    floatingWindow.document.close();

    // Function to copy the datatable and its styles
    function copyDatatableAndStyles() {
        // Get the middle-container element from the floating window (xOrderWindow)
        const floatingMiddleContainer = floatingWindow.document.querySelector('.section.middle-container');

        // Get the table-container element from the original page (index.html)
        const originalTableContainer = document.querySelector('.table-container');

        if (floatingMiddleContainer && originalTableContainer) {
            // Clone the datatable element from the original page
            const clonedDatatable = originalTableContainer.querySelector('#dataTable').cloneNode(true);

            // Get all styles from the original page
            const styles = Array.from(document.styleSheets)
                .filter(styleSheet => {
                    try {
                        return styleSheet.cssRules && styleSheet.cssRules.length > 0;
                    } catch (e) {
                        console.log('Cannot access styleSheet', e);
                        return false;
                    }
                })
                .map(styleSheet => {
                    return Array.from(styleSheet.cssRules)
                        .map(rule => rule.cssText)
                        .join('\n');
                })
                .join('\n');

            // Create a style element and add it to the floating window
            const styleElement = floatingWindow.document.createElement('style');
            styleElement.textContent = styles;
            floatingWindow.document.head.appendChild(styleElement);

            // Add specific styles for the table
            const tableStyles = `
                #dataTable {
                    border-collapse: collapse;
                    width: 100%;
                }
                #dataTable th, #dataTable td {
                    border: 1px solid black;
                    padding: 8px;
                    text-align: left;
                }
                #dataTable th {
                    background-color: #f2f2f2;
                }
            `;
            const tableStyleElement = floatingWindow.document.createElement('style');
            tableStyleElement.textContent = tableStyles;
            floatingWindow.document.head.appendChild(tableStyleElement);

            // Clear existing content
            floatingMiddleContainer.innerHTML = '';
            // Append the cloned datatable to the floating window's middle-container
            floatingMiddleContainer.appendChild(clonedDatatable);
            console.log('Datatable and styles copied successfully');

            // Start the additional tasks
            setTimeout(() => {
                performAdditionalTasks(floatingWindow);
            }, 900);
        } else {
            console.error('Required elements not found. Retrying...');
            setTimeout(copyDatatableAndStyles, 100); // Retry after 100ms
        }
    }

    // Start the copy process after a short delay
    setTimeout(copyDatatableAndStyles, 500);
}

function performAdditionalTasks(floatingWindow) {
    const table = floatingWindow.document.querySelector('#dataTable');
    if (!table) {
        console.error('Table not found');
        return;
    }

    // 1. 再次複製 dataTable，並命名為 OriTable
    const oriTable = table.cloneNode(true); // 深層複製 dataTable
    oriTable.id = 'OriTable'; // 將新表格的 id 設置為 OriTable
    oriTable.style.marginTop = '10px'; // 設置垂直距離為 10px


    // 2. 找到 bottom-section，並將 OriTable 插入到 bottom-section 中
    const bottomSection = floatingWindow.document.querySelector('.section.bottom-section');
    if (bottomSection) {
        bottomSection.appendChild(oriTable); // 將 OriTable 插入到 bottom-section 中
        // 設置固定寬度和固定佈局
        oriTable.style.tableLayout = 'fixed';
        oriTable.style.width = '100%'; // 確保表格寬度為容器的 100%
        oriTable.style.border = '1px solid black';
        oriTable.style.borderCollapse = 'collapse';

        // 為所有的 td 和 th 元素添加邊框
        const cells = oriTable.querySelectorAll('td, th');
        cells.forEach(cell => {
            cell.style.border = '1px solid black';
        });


    } else {
        console.error('bottom-section not found');
        return;
    }

    // 3. 複製 totalprice 表格並命名為 OriPriceTable
    const originalTotalPriceTable = document.querySelector('#totalprice'); // 從原始頁面查找 totalprice 表格
    if (originalTotalPriceTable) {
        const oriPriceTable = originalTotalPriceTable.cloneNode(true); // 深層複製 totalprice 表格
        oriPriceTable.id = 'OriPriceTable'; // 設置 id 為 OriPriceTable
        oriPriceTable.style.marginTop = '10px'; // 設置垂直距離為 10px

        // 將 OriPriceTable 插入到 OriTable 後面（bottom-section 中）
        bottomSection.appendChild(oriPriceTable);

        // 調整 OriPriceTable 的寬度為 bottom-section 的 95%
        oriPriceTable.style.width = '98%'; // 直接設置寬度為 95%
        oriPriceTable.style.boxSizing = 'border-box'; // 確保 padding 不影響總寬度
        oriPriceTable.style.borderCollapse = 'collapse'; // 設置表格邊框合併
        //為每列手動設置固定寬度（以匹配原始表格的設置）
        const cols = oriPriceTable.querySelectorAll('col');
        cols.forEach((col, index) => {
            //    col.style.width = '15px'; // 設置每一列寬度為 100px，可以根據需求調整
            cell.style.textAlign = 'center';
        });

    } else {
        console.warn('No totalprice table found. Skipping OriPriceTable creation.');
    }

    // 4. 使 middle-container 高度具有彈性（自適應內容高度）
    const middleContainer = floatingWindow.document.querySelector('.section.middle-container');
    if (middleContainer) {
        middleContainer.style.overflow = 'hidden'; // 防止溢出
        middleContainer.style.height = 'auto'; // 設置高度自適應
    }

    // 5. 針對 OriTable 的處理
    // a. 修改第3列表頭為 FName 並清空該列所有單元格內容
    const oriTableHeaders = oriTable.querySelectorAll('th');
    if (oriTableHeaders[3]) {
        oriTableHeaders[3].textContent = 'fname'; // 修改表頭為 FName
        const col3Cells = oriTable.querySelectorAll('tr td:nth-child(4)');
        col3Cells.forEach(cell => cell.textContent = ''); // 清空所有單元格內容
    }

    // b. 修改第4列表頭為 FColor 並清空該列所有單元格內容
    if (oriTableHeaders[4]) {
        oriTableHeaders[4].textContent = 'fcolor'; // 修改表頭為 FColor
        const col4Cells = oriTable.querySelectorAll('tr td:nth-child(5)');
        col4Cells.forEach(cell => cell.textContent = ''); // 清空所有單元格內容
    }

    // c. 刪除第15列（index 15）、第13列（index 13）、第5列（index 5）
    deleteColumnByIndex(oriTable, 15); // 刪除第15列
    deleteColumnByIndex(oriTable, 13); // 刪除第13列
    deleteColumnByIndex(oriTable, 5);  // 刪除第5列
    // 6. 修改 OriTable 列的寬度
    const oriTableCols = oriTable.querySelectorAll('col');


    // 以下是針對 dataTable 的一系列處理
    moveColumnData(table, 1, 14); //把W搬去表格2的Price
    moveColumnData(table, 2, 15); //把H搬去表格2的Dis

    changeColumnHeader(table, 1, 'FbName');  //把原表格W改名布料名
    changeColumnHeader(table, 2, 'FbColor'); //把原表格H改名布料色

    processColumn(table, 3, 'BO', floatingWindow); //把原表格改網底色
    processColumn(table, 4, 'BO2', floatingWindow); //把原表格改網底色
    processColumn(table, 5, 'SN', floatingWindow); //把原表格改網底色

    moveColumn(table, 6, 13); //把原本格的over搬去NA
    changeColumnHeader(table, 3, 'Fb W'); //把原表格的BO改名布料寬
    changeColumnHeader(table, 4, 'Fb H'); //把原表格的BO2改名布料高
    clearColumnExceptHeader(table, 3); //把原表格BO內容清除
    clearColumnExceptHeader(table, 4);//把原表格BO2內容清除

    subtractFromColumn(table, 14, 3, 31);//把原表格W（Price）減31轉貼表格2的FW
    subtractFromColumn(table, 14, 5, 27);//把原表格H（Dis）內容減27轉貼表格2的(下面指令會更名為Tube）
    subtractFromColumn(table, 14, 6, 31);//把原表格NA（NA）內容減31轉貼表格2的Over

    addToColumnAndMove(table, 15, 4, 200);//把原表格Dis（FH）內容加200轉貼表格2的FH

    changeColumnHeader(table, 5, 'Tube');
    changeColumnHeader(table, 6, 'Btm');
    changeColumnHeader(table, 7, 'Over');

    moveColumn(table, 13, 7);

    changeColumnHeader(table, 10, 'Ori NO');
    fillColumnWithNumbers(table, 10);

    deleteColumns(table, [15, 13, 12, 11]);

    // 6. 新增 copyNC 函數的執行
    copyNC(table, oriTable);
    // 調整 OriTable 列寬
    adjustOriTableColumnWidths(oriTable);

    processAndReorganizeTable(floatingWindow);
    Redoprice(floatingWindow);
}

// 刪除指定索引的列
function deleteColumnByIndex(table, index) {
    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        row.deleteCell(index); // 刪除指定列的單元格
    }
}



function moveColumnData(table, fromIndex, toIndex) {
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const fromCell = rows[i].cells[fromIndex];
        const toCell = rows[i].cells[toIndex];
        toCell.textContent = fromCell.textContent;
        fromCell.textContent = '';
    }
}

function changeColumnHeader(table, columnIndex, newHeader) {
    const cell = table.rows[0].cells[columnIndex];
    cell.textContent = newHeader;
    cell.style.fontSize = '60%'; // 將字體縮小一級
}

function processColumn(table, colIndex, columnName, floatingWindow) {
    for (let i = 1; i < table.rows.length; i++) {
        if (table.rows[i].cells[colIndex].querySelector('.round-button.active')) {
            const name = promptForInput(`Input the name and color of the ${columnName}, Do not leave it blank`, 'Name', floatingWindow);
            const color = promptForInput(`Input the name and color of the ${columnName}, Do not leave it blank`, 'Color', floatingWindow);

            if (name && color) {
                for (let j = 1; j < table.rows.length; j++) {

                    if (table.rows[j].cells[colIndex].querySelector('.round-button.active')) {
                        // 新增的步驟：根據 colIndex 設置背景顏色
                        if (colIndex === 3) {
                            table.rows[j].cells[0].style.backgroundColor = 'lightblue';
                        } else if (colIndex === 4) {
                            table.rows[j].cells[0].style.backgroundColor = 'lightyellow';
                        } else if (colIndex === 5) {
                            table.rows[j].cells[0].style.backgroundColor = 'pink';
                        }

                        table.rows[j].cells[1].textContent = name;
                        table.rows[j].cells[2].textContent = color;
                    }
                }
            }
            break; // Exit after processing the first occurrence
        }
    }
}

function promptForInput(message, field, floatingWindow) {
    let input;
    do {
        input = floatingWindow.prompt(`${message}\n${field}:`);
    } while (input === '');
    return input;
}

function moveColumn(table, fromIndex, toIndex) {
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        rows[i].cells[toIndex].textContent = rows[i].cells[fromIndex].textContent;
        rows[i].cells[fromIndex].textContent = '';
    }
}

function clearColumnExceptHeader(table, columnIndex) {
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        rows[i].cells[columnIndex].textContent = '';
    }
}

function subtractFromColumn(table, fromIndex, toIndex, subtrahend) {
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const fromValue = parseFloat(rows[i].cells[fromIndex].textContent);
        if (!isNaN(fromValue)) {
            rows[i].cells[toIndex].textContent = (fromValue - subtrahend).toString();
        }
    }
}

function addToColumnAndMove(table, fromIndex, toIndex, addend) {
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const fromValue = parseFloat(rows[i].cells[fromIndex].textContent);
        if (!isNaN(fromValue)) {
            rows[i].cells[toIndex].textContent = (fromValue + addend).toString();
        }
        rows[i].cells[fromIndex].textContent = '';
    }
}

function fillColumnWithNumbers(table, columnIndex) {
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        rows[i].cells[columnIndex].textContent = i.toString();
    }
}

function deleteColumns(table, columnIndexes) {
    // 對索引進行排序和去重
    const uniqueSortedIndexes = [...new Set(columnIndexes)].sort((a, b) => b - a);

    const rows = table.rows;
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < uniqueSortedIndexes.length; j++) {
            const columnIndex = uniqueSortedIndexes[j];
            if (columnIndex < rows[i].cells.length) {
                rows[i].deleteCell(columnIndex);
            }
        }
    }
}

// Define the new function at the end of the file
function processAndReorganizeTable(floatingWindow) {
    const table = floatingWindow.document.querySelector('#dataTable');
    if (!table) {
        console.error('Table not found');
        return;
    }

    // 1. Check index 0 row and record cell colors
    const lightBlueRows = [];
    const lightYellowRows = [];
    const pinkRows = [];
    const rows = table.rows;
    for (let i = 1; i < rows.length; i++) {
        const cell = rows[i].cells[0];
        const backgroundColor = window.getComputedStyle(cell).backgroundColor;
        if (backgroundColor === 'rgb(173, 216, 230)') { // Light blue
            lightBlueRows.push(i);
        } else if (backgroundColor === 'rgb(255, 255, 224)') { // Light yellow
            lightYellowRows.push(i);
        } else if (backgroundColor === 'rgb(255, 192, 203)') { // Pink
            pinkRows.push(i);
        }
    }

    // 2. Create a new table (datatable2) with the same size and style
    const datatable2 = table.cloneNode(false);
    table.parentNode.insertBefore(datatable2, table.nextSibling);

    // 3. Copy the header from datatable to datatable2
    datatable2.appendChild(rows[0].cloneNode(true));

    // 4, 5, 6. Copy rows based on color groups
    function copyRows(rowIndexes) {
        for (const index of rowIndexes) {
            datatable2.appendChild(rows[index].cloneNode(true));
        }
    }
    copyRows(lightBlueRows);
    copyRows(lightYellowRows);
    copyRows(pinkRows);

    // 7. Delete the original datatable
    table.parentNode.removeChild(table);

    // 8. Fill index 0 column with sequential numbers
    for (let i = 1; i < datatable2.rows.length; i++) {
        datatable2.rows[i].cells[0].textContent = i.toString();
    }

}

function copyNC(dataTable, oriTable) {
    // 取得 dataTable 第2列與第3列的所有單元格（跳過表頭）
    const dataRows = dataTable.querySelectorAll('tr'); // 獲取所有行（包括表頭）
    const oriRows = oriTable.querySelectorAll('tr');   // 獲取 oriTable 的所有行（包括表頭）

    if (dataRows.length !== oriRows.length) {
        console.warn('Row count mismatch between dataTable and oriTable');
        return;
    }

    // 從第1行（index 1）開始，依序複製單元格內容
    for (let i = 1; i < dataRows.length; i++) { // 跳過表頭（index 0）
        const dataCells = dataRows[i].querySelectorAll('td'); // 取得 dataTable 當前行的所有單元格
        const oriCells = oriRows[i].querySelectorAll('td');   // 取得 oriTable 當前行的所有單元格

        if (dataCells[1]) {
            oriCells[3].textContent = dataCells[1].textContent; // 將第2列（index 1）的內容複製到第4列（index 3）
        }
        if (dataCells[2]) {
            oriCells[4].textContent = dataCells[2].textContent; // 將第3列（index 2）的內容複製到第5列（index 4）
        }
    }

    console.log('Copy operation completed successfully');
}

function adjustOriTableColumnWidths(oriTable) {
    // 創建 colgroup 標籤
    const colGroup = document.createElement('colgroup');

    // 定義每一列的寬度
    const columnWidths = [
        '14px',  // 第 1 列 NO
        '18px',  // 第 2 列 W
        '18px',  // 第 3 列 H
        '24px',  // 第 4 列 name
        '24px',  // 第 5 列 color
        '17px',  // 第 6 列 over
        '17px',  // 第 7 列 i/o
        '15px',  // 第 8 列 LR
        '19px',  // 第 9 列 chain
        '15px',  // 第 10 列 drive
        '15px',  // 第 11 列 bket
        '15px',  // 第 12 列 motor
        '15px'   // 第 13 列 price
    ];

    // 為每一列創建 col 標籤並設置寬度
    columnWidths.forEach(width => {
        const col = document.createElement('col');
        col.style.width = width;
        colGroup.appendChild(col);
    });

    // 將 colgroup 插入到 oriTable 的開頭
    oriTable.insertBefore(colGroup, oriTable.firstChild);

    // 將表頭單元格的字體縮小至 80%
    const headerCells = oriTable.querySelectorAll('thead th');
    headerCells.forEach(cell => {
        cell.style.fontSize = '80%';
    });

}

function Redoprice(floatingWindow) {
    // 針對 datatable2 的處理
    const datatable2 = floatingWindow.document.querySelector('#dataTable');
    const oritable = floatingWindow.document.querySelector('#OriTable');

    if (datatable2 && oritable) {
        const datatable2Rows = datatable2.rows;
        const oritableRows = oritable.rows;

        // 從第 1 行開始（跳過表頭）
        for (let i = 1; i < datatable2Rows.length; i++) {
            const itemNoCell = datatable2Rows[i].cells[10]; // 取得 datatable2 的第 10 欄單元格
            const itemNo = parseInt(itemNoCell.textContent, 10); // 將內容轉為數字（ItemNO）

            if (!isNaN(itemNo) && itemNo < oritableRows.length) {
                // 根據 ItemNO 找到 oritable 中對應的行
                const oritableRow = oritableRows[itemNo];
                const rPriceCell = oritableRow.cells[12]; // 取得 oritable 的第 12 欄單元格
                const rPrice = rPriceCell.textContent; // 取得內容（RPrice）

                // 將 RPrice 覆蓋至 datatable2 的第 11 欄
                datatable2Rows[i].cells[11].textContent = rPrice;
            }
        }
    } else {
        console.error('datatable2 or oritable not found');
    }
}






