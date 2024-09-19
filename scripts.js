document.addEventListener('DOMContentLoaded', () => {
    const addRowButton = document.getElementById('add-row');
    const addColumnButton = document.getElementById('add-column');
    const editColumnButton = document.getElementById('edit-column');
    const deleteColumnButton = document.getElementById('delete-column');
    const saveDataButton = document.getElementById('save-data');
    const calculateTotalButton = document.getElementById('calculate-total');
    const totalSalaryElem = document.getElementById('total-salary');
    const totalInvestmentsElem = document.getElementById('total-investments');
    const totalSipElem = document.getElementById('total-sip');
    const totalGoldElem = document.getElementById('total-gold');
    const totalGroceryElem = document.getElementById('total-grocery');
    const totalSavingsElem = document.getElementById('total-savings');
    const dataTableBody = document.querySelector('#data-table tbody');
    const headerRow = document.getElementById('header-row');
    const ctx = document.getElementById('expenditureChart').getContext('2d');

    // Chart initialization
    const expenditureChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [], // will be populated dynamically
            datasets: [{
                label: 'Expenditure',
                data: [], // will be populated dynamically
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Update chart based on table data
    function updateChart() {
        const labels = [];
        const data = [];

        dataTableBody.querySelectorAll('tr').forEach(row => {
            const description = row.cells[0].querySelector('input').value;
            const value = parseFloat(row.cells[1].querySelector('input').value) || 0;
            if (description) {
                labels.push(description);
                data.push(value);
            }
        });

        expenditureChart.data.labels = labels;
        expenditureChart.data.datasets[0].data = data;
        expenditureChart.update();
    }

    // Update totals
    function updateTotals() {
        let totalSalary = 0;
        let totalInvestments = 0;
        let totalSip = 0;
        let totalGold = 0;
        let totalGrocery = 0;

        dataTableBody.querySelectorAll('tr').forEach(row => {
            totalSalary += parseFloat(row.cells[1].querySelector('input').value) || 0;
            totalInvestments += parseFloat(row.cells[2].querySelector('input').value) || 0;
            totalSip += parseFloat(row.cells[3].querySelector('input').value) || 0;
            totalGold += parseFloat(row.cells[4].querySelector('input').value) || 0;
            totalGrocery += parseFloat(row.cells[5].querySelector('input').value) || 0;
        });

        totalSalaryElem.textContent = totalSalary.toFixed(2);
        totalInvestmentsElem.textContent = totalInvestments.toFixed(2);
        totalSipElem.textContent = totalSip.toFixed(2);
        totalGoldElem.textContent = totalGold.toFixed(2);
        totalGroceryElem.textContent = totalGrocery.toFixed(2);

        const totalExpenditure = totalSalary + totalInvestments + totalSip + totalGold + totalGrocery;
        totalSavingsElem.textContent = `Total Savings: ${totalExpenditure.toFixed(2)}`;

        updateChart();
    }

    // Add row
    addRowButton.addEventListener('click', () => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td><input type="text" placeholder="Row Description" class="form-control"></td>
            <td><input type="number" class="form-control numeric-input"></td>
            <td><input type="number" class="form-control numeric-input"></td>
            <td><input type="number" class="form-control numeric-input"></td>
            <td><input type="number" class="form-control numeric-input"></td>
            <td><input type="number" class="form-control numeric-input"></td>
            <td><button class="btn btn-danger btn-sm delete-row">Delete Row</button></td>
        `;
        dataTableBody.appendChild(newRow);
        updateTotals();
    });

    // Add column
    addColumnButton.addEventListener('click', () => {
        const newColumnName = prompt('Enter new column name:');
        if (newColumnName) {
            // Update header
            const newHeaderCell = document.createElement('th');
            newHeaderCell.textContent = newColumnName;
            headerRow.insertBefore(newHeaderCell, headerRow.lastElementChild);

            // Update rows
            dataTableBody.querySelectorAll('tr').forEach(row => {
                const newCell = document.createElement('td');
                newCell.innerHTML = `<input type="number" class="form-control numeric-input">`;
                row.insertBefore(newCell, row.lastElementChild);
            });

            // Update footer
            const newFooterCell = document.createElement('td');
            newFooterCell.id = `total-${newColumnName.toLowerCase()}`;
            newFooterCell.textContent = '0';
            document.querySelector('tfoot tr').insertBefore(newFooterCell, document.querySelector('tfoot tr').lastElementChild);

            // Update chart
            updateTotals();
        }
    });

    // Edit column
    editColumnButton.addEventListener('click', () => {
        const columnIndex = prompt('Enter column index to edit (0-based):');
        const newColumnName = prompt('Enter new column name:');
        if (columnIndex !== null && newColumnName) {
            const th = headerRow.querySelectorAll('th')[parseInt(columnIndex) + 1];
            if (th) {
                th.textContent = newColumnName;
                dataTableBody.querySelectorAll('tr').forEach(row => {
                    const cell = row.querySelectorAll('td')[parseInt(columnIndex) + 1];
                    if (cell) {
                        cell.querySelector('input').setAttribute('placeholder', newColumnName);
                    }
                });
                document.querySelectorAll(`tfoot td`)[parseInt(columnIndex) + 1].id = `total-${newColumnName.toLowerCase()}`;
                updateTotals();
            }
        }
    });

    // Delete column
    deleteColumnButton.addEventListener('click', () => {
        const columnIndex = prompt('Enter column index to delete (0-based):');
        if (columnIndex !== null) {
            const index = parseInt(columnIndex) + 1; // Skip the first column (description)
            if (index > 0) {
                // Remove header
                headerRow.querySelectorAll('th')[index].remove();

                // Remove rows
                dataTableBody.querySelectorAll('tr').forEach(row => {
                    row.querySelectorAll('td')[index].remove();
                });

                // Remove footer
                document.querySelectorAll('tfoot td')[index].remove();
                updateTotals();
            }
        }
    });

    // Delete row
    dataTableBody.addEventListener('click', event => {
        if (event.target.classList.contains('delete-row')) {
            event.target.closest('tr').remove();
            updateTotals();
        }
    });

    // Calculate total savings
    calculateTotalButton.addEventListener('click', updateTotals);

    // Save data (dummy implementation)
    saveDataButton.addEventListener('click', () => {
        alert('Data saved!');
    });

    // Initialize totals
    updateTotals();
});
