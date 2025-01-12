const ButtonModule = (function () {

    function deleteRow(dataTable, rowNumber) {
        const rowIndex = parseInt(rowNumber);
        if (isNaN(rowIndex) || rowIndex < 1 || rowIndex > dataTable.table.rows.length - 1) {
            alert("Target Row not found。");
            return;
        }

        const row = dataTable.table.rows[rowIndex];
        if (!row) {
            alert("Target Row not found。");
            return;
        }

        const isEmpty = Array.from(row.cells).slice(1).every(cell => cell.textContent.trim() === '');
        if (isEmpty) {
            const confirmDelete = confirm("It's a blank row; delete？");
            if (!confirmDelete) {
                return;
            }
        }

        dataTable.table.deleteRow(rowIndex);

        const rows = dataTable.table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });

        alert(`No. ${rowNumber} Row deleted。`);
    }

    function insertRow(dataTable, rowNumber) {
        const rowIndex = parseInt(rowNumber);
        if (isNaN(rowIndex) || rowIndex < 1 || rowIndex > dataTable.table.rows.length) {
            alert("No such row, try again。");
            return;
        }

        const tbody = dataTable.table.querySelector('tbody');
        const newRow = tbody.insertRow(rowIndex);

        for (let j = 0; j < 16; j++) {
            const cell = newRow.insertCell();
            if (j === 0) {
                cell.textContent = rowIndex + 1;
            } else {
                dataTable.setupCell(cell, j);
            }
        }

        // 更新所有後續行的編號
        for (let i = rowIndex + 1; i < tbody.rows.length; i++) {
            tbody.rows[i].cells[0].textContent = i + 1;
        }

        dataTable.setActiveCell(newRow.cells[1]);
        dataTable.numberInput.focus();

        scrollToRow(dataTable, rowIndex);

        dataTable.table.style.display = 'none';
        dataTable.table.offsetHeight; // Force a reflow
        dataTable.table.style.display = '';

        alert(`Added a new row below the Row.${rowNumber} 。`);
    }

    function scrollToRow(dataTable, rowIndex) {
        requestAnimationFrame(() => {
            if (rowIndex >= 1 && rowIndex < dataTable.table.rows.length) {
                const rowToScroll = dataTable.table.rows[rowIndex];
                rowToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }



    function scrollToRow(dataTable, rowIndex) {
        requestAnimationFrame(() => {
            if (rowIndex >= 1 && rowIndex < dataTable.table.rows.length) {
                const rowToScroll = dataTable.table.rows[rowIndex];
                rowToScroll.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    }

    // 將模組內的函數暴露給外部使用
    return {
        deleteRow,
        insertRow
    };

})();


