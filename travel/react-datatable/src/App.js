import { useState, useCallback } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const columns = [
  { name: 'ID', selector: row => row.id, sortable: true, sortField: 'id', width:'100px' },
  { name: 'IMAGE', selector: row => row.coverimage, cell: row =><img src={row.coverimage} width={100} alt={row.name}></img>, width:'150px' },
  { name: 'NAME', selector: row => row.name, sortable: true, sortField: 'name', width:'150px' },
  { name: 'DETAIL', selector: row => row.detail, sortable: true, sortField: 'detail', width:'750px' },
  { name: 'LAT', selector: row => row.latitude, sortable: true, sortField: 'latitude' },
  { name: 'LNG', selector: row => row.longitude, sortable: true, sortField: 'longitude' },
];

function App() {  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState('');
  const [sortColumnDir, setSortcolumnDir] = useState('');
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    let url = `http://localhost:5000/api/attractions?page=${page}&per_page=${perPage}`;

    if (sortColumn) {
      url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDir}`;
    }
    if (search) {
      url += `&search=${search}`;
    }
    
    const response = await axios.get(url);
    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  }, [page, perPage, sortColumn, sortColumnDir, search]);

  const handlePageChange = page => {
    setPage(page);
    fetchData(); // Fetch data on page change
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
    fetchData(); // Fetch data when rows per page change
  };

  const handleSort = (column, sortDirection) => {
    setSortColumn(column.sortField);
    setSortcolumnDir(sortDirection);
    fetchData(); // Fetch data on sort change
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchData(); // Fetch data only on form submission
  };

  return (
    <div>
      <form onSubmit={handleSearchSubmit}>
        <label>
          Search:
          <input type="text" name="search" onChange={handleSearchChange} />
        </label>
        <input type="submit" value="Search" />
      </form>
      <DataTable
        title="Attraction"
        columns={columns}
        data={data}
        sortServer
        onSort={handleSort}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      />
    </div>
  );
}

export default App;
