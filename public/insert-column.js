document.addEventListener('DOMContentLoaded', fetchColumns);

function fetchColumns() {
    const urlParams = new URLSearchParams(window.location.search);
    const tableName = urlParams.get('tableName');

    // Display table name at the top
    const tableNameElement = document.createElement('h2');
    tableNameElement.textContent = tableName;
    document.getElementById('recordTable').appendChild(tableNameElement);

    fetch(`/tables/${tableName}/columns`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch columns');
            }
            return response.json();
        })
        .then(data => {
            const insertForm = document.getElementById('insertForm');
            data.forEach(column => {
                const label = document.createElement('label');
                label.textContent = column;
                const input = document.createElement('input');
                input.type = 'text';
                input.name = column;
                insertForm.appendChild(label);
                insertForm.appendChild(input);
            });
        })
        .catch(error => {
            console.error('Error fetching columns:', error);
            alert('Failed to fetch columns. Please try again later.');
        });

    fetchRecordsAndDisplay();
}

document.addEventListener('DOMContentLoaded', function() {
    const insertForm = document.getElementById('insertForm');
    if (insertForm) {
        insertForm.addEventListener('submit', insertValues);
    } else {
        console.error("insertForm not found.");
    }
});

function insertValues(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const values = {};
    formData.forEach((value, key) => {
        values[key] = value;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const tableName = urlParams.get('tableName');

    fetch(`/tables/${tableName}/records`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to insert values');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
        fetchRecordsAndDisplay(); 
    })
    .catch(error => {
        console.error('Error inserting values:', error);
        alert('Failed to insert values. Please try again later.');
    });
}

function fetchRecordsAndDisplay() {
    const urlParams = new URLSearchParams(window.location.search);
    const tableName = urlParams.get('tableName');

    fetch(`/tables/${tableName}/records`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch records');
            }
            return response.json();
        })
        .then(records => {
            displayRecords(records, tableName); // Pass tableName to displayRecords function
        })
        .catch(error => {
            console.error('Error fetching records:', error);
            alert('Failed to fetch records. Please try again later.');
        });
}

function displayRecords(records, tableName) {
    const tableContainer = document.getElementById('recordTable');
    tableContainer.innerHTML = ''; 

    if (records.length === 0) {
        const noRecordsMessage = document.createElement('p');
        noRecordsMessage.textContent = 'No records found';
        tableContainer.appendChild(noRecordsMessage);
        return; 
    }

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    const headers = Object.keys(records[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });

    headerRow.innerHTML += '<th>Action</th>';
    thead.appendChild(headerRow);

    records.forEach(record => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const cell = document.createElement('td');
            cell.textContent = record[header];
            row.appendChild(cell);
        });

        const deleteButtonCell = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-btn');
        deleteButton.dataset.recordId = record.id; 
        deleteButton.addEventListener('click', function() {
            deleteRecord(tableName, this.parentNode.parentNode); // Pass tableName to deleteRecord function
        });
        deleteButtonCell.appendChild(deleteButton);
        row.appendChild(deleteButtonCell);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

function deleteRecord(tableName, rowElement) {
    const recordId = rowElement.querySelector('.delete-btn').dataset.recordId;

    if (!recordId) {
        console.error('Record ID not found');
        return;
    }

    fetch(`/tables/${tableName}/records/${recordId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete record');
        }
        return response.json();
    })
    .then(() => {
        rowElement.remove();
        alert('Record deleted successfully');
    })
    .catch(error => {
        console.error('Error deleting record:', error);
        alert('Failed to delete record. Please try again later.');
    });
}
