import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useParams, useNavigate } from "react-router";

const port = 3001;

const RecordHeader = (props) => {
  return (
    <th style={{ position: "sticky", top: "0px", background: "#f8f8f8" }}>
      {props.item}
    </th>
  );
};

const RecordValues = (props) => {
  const params = useParams();
  return (
    <tr>
      {props.values.map((value, index) => {
        return <td key={index}>{value}</td>;
      })}
      <td>
        <span>
          <button
            className="btn btn-link"
            onClick={async () => {
              if (window.confirm("Удалить запись?")) {
                await fetch(
                  `http://localhost:${port}/delete/${params.table.toString()}/${
                    props.keyProp
                  }`,
                  {
                    method: "DELETE",
                  }
                );
                let newValues = props.allValues;
                newValues = newValues.filter((el) => el[0] !== props.keyProp);
                props.setValues(newValues);
              }
            }}
          >
            Удалить
          </button>
          <br></br>
          <Link to={`/view/${params.table.toString()}/${props.keyProp}`}>
            Изменить
          </Link>
        </span>
      </td>
    </tr>
  );
};

const TableView = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [isTableEmpty, setIsTableEmpty] = useState(false);
  const [headers, setHeaders] = useState([]);
  const [values, setValues] = useState([]);
  useEffect(() => {
    const getRecords = async () => {
      let responce = await fetch(
        `http://localhost:${port}/view/${params.table.toString()}`
      );
      if (!responce.ok) {
        const message = `An error has occurred: ${responce.statusText}`;
        window.alert(message);
        return;
      }
      const record = await responce.json();
      if (!record) {
        window.alert(`Record`);
        navigate("/");
        return;
      }
      if (record.length === 0) {
        setIsTableEmpty(true);
        responce = await fetch(
          `http://localhost:${port}/test/${params.table.toString()}`
        );
        if (!responce.ok) {
          const message = `An error has occurred: ${responce.statusText}`;
          window.alert(message);
          return;
        }
        const tempRecord = await responce.json();
        if (!tempRecord) {
          window.alert(`Record`);
          navigate("/");
          return;
        }
        tempRecord.forEach((element) => {
          record[0] = { ...record[0], [element.name]: "" };
        });
      }
      // Object.keys(record[0]).filter(key => key !== "удален");
      setHeaders(Object.keys(record[0]).filter((key) => key !== "удален"));
      const valuesArray = [];
      let tempValues = [];
      record.forEach((value) => {
        for (const key in value) {
          if (Object.hasOwnProperty.call(value, key)) {
            const element = value[key];
            if (key !== "удален") {
              tempValues.push(element);
            }
          }
        }
        valuesArray.push(tempValues);
        tempValues = [];
      });
      setValues(valuesArray);
    };
    getRecords();
    return;
  }, [params.table, navigate]);

  const displayHeader = () => {
    return headers.map((item, index) => {
      return <RecordHeader item={item} key={index} />;
    });
  };

  const displayValues = () => {
    if (isTableEmpty) return <tr></tr>;
    return values.map((value) => {
      return (
        <RecordValues
          setValues={setValues}
          values={value}
          allValues={values}
          keyProp={value[0]}
          key={value[0]}
        ></RecordValues>
      );
    });
  };

  return (
    <div>
      <div className="header container-fluid">
        <Link className="header-link" to="/">
          На Главную
        </Link>
        <Link
          className="btn btn-link header-link"
          to={`/create/${params.table}`}
        >
          Создать новую запись
        </Link>
        <h3>{params.table.toString()}</h3>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            {displayHeader()}
            <th
              style={{ position: "sticky", top: "0px", background: "#f8f8f8" }}
            >
              Действие
            </th>
          </tr>
        </thead>
        <tbody>{displayValues()}</tbody>
      </table>
    </div>
  );
};

export default TableView;
