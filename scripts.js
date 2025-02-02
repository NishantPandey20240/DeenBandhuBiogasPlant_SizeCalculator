document.getElementById('calculateBtn').addEventListener('click', () => {
    const plantCapacity = parseFloat(document.getElementById('plantCapacity').value);
    const hrt = parseFloat(document.getElementById('hrt').value);
  
    if (isNaN(plantCapacity) || isNaN(hrt) || plantCapacity <= 0 || hrt <= 0) {
      alert('Please enter valid positive numbers for plant capacity and HRT.');
      return;
    }
  
    const { R1, H1, R2, H2, V1, V2, v1_v2_ratio } = calculateValues(plantCapacity, hrt);
  
    // Display the result table
    const tableBody = document.querySelector('#resultTable tbody');
    tableBody.innerHTML += `
      <tr>
        <td>${plantCapacity.toFixed(2)}</td>
        <td>${hrt.toFixed(2)}</td>
        <td>${R1.toFixed(2)}</td>
        <td>${H1.toFixed(2)}</td>
        <td>${R2.toFixed(2)}</td>
        <td>${H2.toFixed(2)}</td>
        <td>${V1.toFixed(2)}</td>
        <td>${V2.toFixed(2)}</td>
        <td>${v1_v2_ratio.toFixed(2)}</td>
      </tr>
    `;
  
    document.getElementById('resultTable').style.display = 'table';
  });
  
  document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('plantCapacity').value = '';
    document.getElementById('hrt').value = '';
    document.querySelector('#resultTable tbody').innerHTML = '';
    document.getElementById('resultTable').style.display = 'none';
  });
  
  document.getElementById('printBtn').addEventListener('click', () => {
    const table = document.getElementById('resultTable');
    const printWindow = window.open('', '', 'height=500,width=700');
    printWindow.document.write('<html><head><title>Print Table</title></head><body>');
    printWindow.document.write(table.outerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  });
  
  document.getElementById('downloadBtn').addEventListener('click', () => {
    const table = document.getElementById('resultTable');
    const csv = tableToCSV(table);
    downloadCSV(csv, 'biogas_calculator_results.csv');
  });
  
 
  function calculateValues(plantCapacity, hrt) {
    const m_R1 = 0.001874, c_R1 = 3.1478, m_prime_R1 = 0.0001449, c_prime_R1 = 0.2287;
    const m_R2 = 0.0027026, c_R2 = 2.9023, m_prime_R2 = 0.000194, c_prime_R2 = 0.3065;

    // Calculate R1
    const log_a_R1 = m_R1 * hrt + c_R1;
    const b_R1 = m_prime_R1 * hrt + c_prime_R1;
    const R1 = Math.pow(10, log_a_R1 + b_R1 * Math.log10(plantCapacity));

    // Calculate R2
    const log_a_R2 = m_R2 * hrt + c_R2;
    const b_R2 = m_prime_R2 * hrt + c_prime_R2;
    const R2 = Math.pow(10, log_a_R2 + b_R2 * Math.log10(plantCapacity));

    // Calculate H2 and H1
    const H2 = 0.55 * R2;
    const H1 = 0.41 * R2;

    // Calculate V1
    const V1 = ((Math.PI * R2 * Math.pow(H2, 2)) - (Math.PI * Math.pow(H2, 3) / 3)) /1e9;

    // Calculate V2
    const V2 = ((Math.PI * R2 * Math.pow(H1, 2)) - (Math.PI * Math.pow(H1, 3) / 3)) /1e9;

    // Calculate (V1 - V2) ratio
    // const v1_v2_ratio =(V1 - V2) * 100/plantCapacity;
    const v1_v2_ratio = parseFloat(((V1 - V2) * 100 / plantCapacity).toFixed(2));

    
    

    return { 
      R1: parseFloat(R1.toFixed(2)), 
      H1: parseFloat(H1.toFixed(2)), 
      R2: parseFloat(R2.toFixed(2)), 
      H2: parseFloat(H2.toFixed(2)), 
      V1: parseFloat(V1.toFixed(2)), 
      V2: parseFloat(V2.toFixed(2)), 
      v1_v2_ratio 
  };
  
} 
  
  
  function tableToCSV(table) {
    const rows = table.querySelectorAll('tr');
    let csv = [];
    rows.forEach(row => {
      const cols = row.querySelectorAll('th, td');
      const data = [];
      cols.forEach(col => data.push(col.innerText));
      csv.push(data.join(','));
    });
    return csv.join('\n');
  }
  
  function downloadCSV(csv, filename) {
    const link = document.createElement('a');
    link.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    link.download = filename;
    link.click();
  }
  