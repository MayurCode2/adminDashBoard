import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import editIcon from "./assets/edit.png"
import Save from "./assets/checked.png"
import Trash from "./assets/trash.png"
import Delete from "./assets/delete.png"
import Next from "./assets/next.png"
import Back from "./assets/back.png"
import LeftArrow from "./assets/leftarrow.png"
import RightArrow from "./assets/rightarrow.png"



const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch data from the provided API endpoint
    fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => response.json())
      .then(data => setMembers(data.map(member => ({ ...member, editable: false }))));
  }, []);

  const handleSearch = term => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const filteredMembers = members.filter(member =>
    Object.values(member).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const handlePageChange = page => {
    setCurrentPage(page);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedMembers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...paginatedMembers]);
    }
  };

  const toggleSelectRow = id => {
    const isSelected = selectedRows.some(row => row.id === id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter(row => row.id !== id));
    } else {
      setSelectedRows([...selectedRows, paginatedMembers.find(row => row.id === id)]);
    }
  };
  

  const deleteSelectedRows = () => {
    setMembers(members.filter(member => !selectedRows.some(row => row.id === member.id)));
    setSelectedRows([]);
  };
  const deleteRows = (id) => {
    setMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id)
    );
  };
  const handleEdit = id => {
    setMembers(members.map(member => {
      if (member.id === id) {
        return { ...member, editable: !member.editable };
      }
      return member;
    }));
  };

  return (
    <div className="AdminDashboard">
      <div className="header">
        <input
        className='search'
          type="text"
          placeholder="Enter Value....."
          value={searchTerm}
          onChange={e => handleSearch(e.target.value)}
        />
        <button
        className="delete-selected"
        onClick={deleteSelectedRows}
        disabled={selectedRows.length === 0}
      >
      <img src={Trash} style={{width:"15px",height:"15px"}} />
      </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={toggleSelectAll}
                checked={selectedRows.length === paginatedMembers.length}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMembers.map(member => (
            <tr
              key={member.id}
              className={selectedRows.some(row => row.id === member.id) ? 'selected' : ''}
            >
              <td>
                <input
                  type="checkbox"
                  onChange={() => toggleSelectRow(member.id)}
                  checked={selectedRows.some(row => row.id === member.id)}
                />
              </td>
              <td contentEditable={member.editable}>{member.name}</td>
              <td contentEditable={member.editable}>{member.email}</td>
              <td contentEditable={member.editable}>{member.role}</td>
              <td>
                <button
                  className="edit"
                  onClick={() => handleEdit(member.id)}
                >
                  {member.editable ? <img src={Save} style={{width:"15px",height:"15px"}} /> : <img src={editIcon} style={{width:"15px",height:"15px"}} />}
                </button>
                <button
                  className="delete"
                  onClick={() => deleteRows(member.id)}
                >
                   <img src={Delete} style={{width:"15px",height:"15px"}} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <div>
        <p>{selectedRows.length} of {filteredMembers.length} rows selected.</p>  
        </div>
       
        <div className='pagination-1'>
        <div>
          <p>Page {currentPage} of {totalPages}</p>
        </div>
        <button
          className="first-page"
          onClick={() => handlePageChange(1)}
        >
          <img src={Back} style={{width:"15px",height:"15px"}}/>
        </button>
        <button
          className="previous-page"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
         <img src={LeftArrow} style={{width:"15px",height:"15px"}}/>
        </button>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="next-page"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <img src={RightArrow} style={{width:"15px",height:"15px"}}/>
        </button>
        <button
          className="last-page"
          onClick={() => handlePageChange(totalPages)}
        >
           <img src={Next} style={{width:"15px",height:"15px"}}/>
        </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
