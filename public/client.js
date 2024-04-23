document.addEventListener('DOMContentLoaded', fetchTables);

function fetchTables() {
    fetch('/tables')
        .then(response => response.json())
        .then(data => {
            const tableList = document.getElementById('tableList');
            tableList.innerHTML = '';
            data.forEach(table => {
                const li = document.createElement('li');
                const link = document.createElement('a');
                link.href = `/insert-column.html?tableName=${table.table_name}`;
                link.textContent = table.table_name;
                li.appendChild(link);
                tableList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching tables:', error));
}

function navigateToCreateTable() {
    window.location.href = '/create-table.html';
}
