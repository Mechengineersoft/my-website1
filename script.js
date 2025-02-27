async function searchData() {
    const blockNo = document.getElementById('blockNo').value;
    const partNo = document.getElementById('partNo').value;
    const thickness = document.getElementById('thickness').value;
  
    if (!blockNo) {
      alert('Block No is required');
      return;
    }
  
    try {
      const response = await fetch(`/.netlify/functions/fetchData?blockNo=${blockNo}&partNo=${partNo}&thickness=${thickness}`);
      const data = await response.json();
      console.log('API Response:', data); // Log the API response
      displayData(data);
    } catch (error) {
      console.error('Error fetching data:', error); // Log any errors
    }
  }

function displayData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    const colorDisplay = document.getElementById('colorDisplay');
    tableBody.innerHTML = '';

    if (data.length > 0) {
        const [blockNo, partNo, thickness, nos, colour1, colour2] = data[0];
        colorDisplay.innerHTML = `Colours: ${colour1} and ${colour2}`;
        colorDisplay.style.color = colour1;
        colorDisplay.style.backgroundColor = colour2;

        data.forEach(row => {
            const tr = document.createElement('tr');
            row.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
            });
            tableBody.appendChild(tr);
        });
    } else {
        colorDisplay.innerHTML = 'No data found';
        colorDisplay.style.color = 'black';
        colorDisplay.style.backgroundColor = 'transparent';
    }
}

function clearData() {
    document.getElementById('blockNo').value = '';
    document.getElementById('partNo').value = '';
    document.getElementById('thickness').value = '';
    document.getElementById('colorDisplay').innerHTML = '';
    document.querySelector('#dataTable tbody').innerHTML = '';
}