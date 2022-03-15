import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import "bootstrap/dist/css/bootstrap.css";
const port = 3001;

const KeysAndValues = ({ value, valueKey, setValues, values }) => {
  return (
    <div className="form-group">
      <label type="text" htmlFor={valueKey}>
        {valueKey}
      </label>
      <input
        className="form-control"
        type={Number.isInteger(value) ? "number" : "text"}
        id={valueKey}
        value={value !== null ? value : ""}
        onChange={(e) => {
          setValues({ ...values, [valueKey]: e.target.value });
        }}
      ></input>
    </div>
  );
};

const RecordView = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [values, setValues] = useState({});

  useEffect(() => {
    const getValues = async () => {
      const responce = await fetch(
        `http://localhost:${port}/view/${params.table.toString()}/${params.id.toString()}`
      );
      if (!responce.ok) {
        const message = `An error has occurred: ${responce.statusText}`;
        window.alert(message);
        return;
      }
      const record = await responce.json();
      if (!record) {
        window.alert(`Record with id ${params.id.toString()} not found`);
        navigate("/");
        return;
      }

      setValues(record[0]);
    };
    getValues();
    return;
  }, [navigate, params.id, params.table]);

  const displayKeysAndValues = () => {
    let records = [];
    for (const key in values) {
      if (Object.hasOwnProperty.call(values, key)) {
        const value = values[key];
        if (key !== "удален" && key !== "остаток" && key !== "rowid")
          records.push(
            <KeysAndValues
              key={key}
              value={value}
              valueKey={key}
              setValues={setValues}
              values={values}
            ></KeysAndValues>
          );
      }
    }
    return records;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    await fetch(
      `http://localhost:${port}/change/${params.table.toString()}/${params.id.toString()}`,
      {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      }
    );
    navigate(`/view/${params.table.toString()}`);
  };

  return (
    <div>
      <div className="header container-fluid">
        <Link className="header-link" to={`/view/${params.table}`}>
          Назад
        </Link>
      </div>
      <div style={{ margin: "0px 15px 0px 15px" }}>
        <form onSubmit={onSubmit}>
          {displayKeysAndValues()}
          <div className="form-group">
            <input
              style={{ marginTop: "15px" }}
              type="submit"
              value="Обновить Запись"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordView;
