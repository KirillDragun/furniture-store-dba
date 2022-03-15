import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
const port = 3001;

const Table = (props) => {
  return (
    <tr>
      <td>
        <Link to={`/view/${props.table.name}`}>{props.table.name}</Link>
      </td>
    </tr>
  );
};

const TableList = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const getTables = async () => {
      const responce = await fetch(`http://localhost:${port}/`, {
        method: "GET",
      });
      if (!responce.ok) {
        const message = `An error occurred: ${responce.statusText}`;
        window.alert(message);
        return;
      }
      const tables = await responce.json();
      setTables(tables);
    };
    getTables();
    return;
  }, [tables.length]);

  const tableList = () => {
    return tables.map((table, index) => {
      return <Table table={table} key={index}></Table>;
    });
  };

  return (
    <div>
      <div className="header container-fluid">
        <h3>Лист Таблиц</h3>
        <Link className="header-link" to="/table/create">
          Создать Таблицу
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Таблица</th>
          </tr>
        </thead>
        <tbody>{tableList()}</tbody>
      </table>
    </div>
  );
};

export default TableList;
