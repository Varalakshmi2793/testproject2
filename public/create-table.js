let columnCount = 0;

function addColumn() {
    const columnsContainer = document.getElementById('columnsContainer');

    const columnDiv = document.createElement('div');
    columnDiv.id = `column-${columnCount}`;

    const columnNameInput = document.createElement('input');
    columnNameInput.type = 'text';
    columnNameInput.name = `columnNames[${columnCount}]`;
    columnNameInput.placeholder = 'Column Name';
    columnNameInput.required = true;

    const columnTypeInput = document.createElement('input');
    columnTypeInput.type = 'text';
    columnTypeInput.name = `columnTypes[${columnCount}]`;
    columnTypeInput.placeholder = 'Column Type';
    columnTypeInput.required = true;

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.type = 'button';
    removeButton.onclick = function () {
        columnsContainer.removeChild(columnDiv);
    };

    columnDiv.appendChild(columnNameInput);
    columnDiv.appendChild(columnTypeInput);
    columnDiv.appendChild(removeButton);

    columnsContainer.appendChild(columnDiv);

    columnCount++;
}

document.getElementById('createTableForm').addEventListener('submit', createTable);

function createTable(event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(event.target);
    const tableName = formData.get('tableName');

    const columnNames = ['id'];
    const columnTypes = ['INT AUTO_INCREMENT PRIMARY KEY'];
   
    for (let i = 0; i < columnCount; i++) {
        const columnName = formData.get(`columnNames[${i}]`);
        const columnType = formData.get(`columnTypes[${i}]`);

        if (columnName && columnType) {
            columnNames.push(columnName);
            columnTypes.push(columnType);
        }
    }
  
    const columns = columnNames.map((name, index) => `${name} ${columnTypes[index]}`).join(', ');

    // Send a POST request to create the table
    fetch('/tables', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tableName, columns })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message); // Display success message
        // Redirect to the index page after creating the table
        window.location.href = '/index.html';
    })
    .catch(error => console.error('Error creating table:', error));
}