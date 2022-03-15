import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router";
const port = 3001;

const CreateTable = () => {
  const navigate = useNavigate();
  const [table, setTable] = useState({
    tableName: "",
    numOfTableValues: 1,
    addRemain: false,
  });
  const [tableValues, setTableValues] = useState([
    { valueName: "", valueType: "", valueIsKey: false },
  ]);

  const changeArray = (e) => {
    setTable({
      ...table,
      numOfTableValues: Number.parseInt(e.target.value),
    });
    let tempArray = [];
    for (let i = 0; i < Number.parseInt(e.target.value); i++) {
      tempArray[i] = {
        valueName: "",
        valueType: "",
        valueIsKey: false,
      };
    }
    setTableValues(tempArray);
  };

  const ValueInput = (props) => {
    return (
      <div style={{ marginBottom: "1.5rem" }}>
        <label type="text" htmlFor={`tableValue${props.id}`}>
          Название столбца
        </label>
        <input
          required
          className="form-control"
          type="text"
          id={`tableValue${props.id}`}
          // value={tableValues[props.id].valueName}
          onChange={(e) => {
            let tempTableValues = tableValues;
            tempTableValues[props.id].valueName = e.target.value;
            setTableValues(tempTableValues);
          }}
        ></input>

        <input
          style={{ marginRight: "0.2rem" }}
          className="form-check-input"
          required
          onChange={handleChange}
          type="radio"
          id={`typeVarchar${props.id}`}
          name={`tableValue${props.id}Type`}
          value="varchar"
        ></input>
        <label
          style={{ marginRight: "1rem" }}
          className="form-check-label"
          htmlFor="typeVarchar"
        >
          Техт
        </label>

        <input
          style={{ marginRight: "0.2rem" }}
          className="form-check-input"
          required
          onChange={handleChange}
          type="radio"
          id={`typeInt${props.id}`}
          name={`tableValue${props.id}Type`}
          value="int"
        ></input>
        <label className="form-check-label" htmlFor="typeInt">
          Число
        </label>
        <br></br>
        <input
          style={{ marginRight: "0.2rem" }}
          className="form-check-input"
          required
          type={"radio"}
          id={`key${props.id}`}
          name={"key"}
          value={`tableKey${props.id}`}
          onChange={() => {
            let tempTableValues = tableValues;
            tempTableValues.map((item) => (item.valueIsKey = false));
            tempTableValues[props.id].valueIsKey = true;
            setTableValues(tempTableValues);
          }}
        ></input>
        <label className="form-check-label" htmlFor={`key${props.id}`}>
          Ключ Таблицы
        </label>
      </div>
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    let payload = table;
    payload.tableValues = tableValues;
    await fetch(`http://localhost:${port}/table/create`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    navigate("/");
  };

  const handleChange = (e) => {
    let inputId = e.target.id;
    inputId = inputId.slice(inputId.length - 1);
    let tempTableValues = tableValues;
    tempTableValues[Number.parseInt(inputId)].valueType = e.target.id;
    setTableValues(tempTableValues);
  };

  const createValuesInput = () => {
    let array = [];
    let numOfValues = table.numOfTableValues;
    for (let i = 0; i < numOfValues; i++) {
      array.push(<ValueInput id={i} key={i}></ValueInput>);
    }
    return array;
  };

  return (
    <div>
      <div className="header container-fluid">
        <Link className="header-link" to={`/`}>
          Назад
        </Link>
        <h3>Новая таблица</h3>
      </div>
      <div style={{ margin: "0px 15px 0px 15px" }}>
        <form onSubmit={onSubmit}>
          <label type="text" htmlFor="tableName">
            Название таблицы
          </label>
          <input
            required
            className="form-control"
            type="text"
            id="tableName"
            value={table.tableName}
            onChange={(e) => {
              setTable({ ...table, tableName: e.target.value });
            }}
          ></input>
          <label type="text" htmlFor="numOfTableValues">
            Количество столбцов
          </label>
          <input
            min={1}
            className="form-control"
            type="number"
            id="numOfTableValues"
            value={table.numOfTableValues}
            onChange={changeArray}
          ></input>
          <input
            style={{ margin: "1rem 0.5rem 1rem 0rem" }}
            className="form-check-input"
            type={"checkbox"}
            value={table.addRemain}
            id="tableRemain"
            onChange={() => {
              setTable({ ...table, addRemain: !table.addRemain });
            }}
          ></input>
          <label
            style={{ margin: "0.7rem 0rem 0rem 0rem" }}
            className="form-check-label"
            type="text"
            htmlFor="tableRemain"
          >
            Добавить "Остаток" в таблицу
          </label>
          <br></br>
          {createValuesInput()}
          <br></br>
          <input
            type="submit"
            value="Создать таблицу"
            className="btn btn-primary"
          ></input>
        </form>
      </div>
    </div>
  );
};

export default CreateTable;
