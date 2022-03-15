import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
const port = 3001;
const KeysAndValues = ({ value, valueKey, setValues, values }) => {
  return (
    <div className="form-group">
      <label type="text" htmlFor={valueKey}>
        {valueKey}
      </label>
      <input
        required
        className="form-control"
        type="text"
        id={valueKey}
        value={value}
        onChange={(e) => {
          setValues({ ...values, [valueKey]: e.target.value });
        }}
      ></input>
    </div>
  );
};

const CreateRecord = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [values, setValues] = useState({});
  useEffect(() => {
    const getValues = async () => {
      let responce = await fetch(
        `http://localhost:${port}/view/${params.table.toString()}/1`
      );
      if (!responce.ok) {
        const message = `An error has occurred: ${responce.statusText}`;
        window.alert(message);
        return;
      }
      const record = await responce.json();
      if (record.length === 0) {
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
      let tempValues = {};
      Object.keys(record[0]).map((key) => {
        if (key === "rowid") {
          tempValues = { ...tempValues, [key]: null };
        } else if (key === "удален") {
          tempValues = { ...tempValues, [key]: 0 };
        } else tempValues = { ...tempValues, [key]: "" };
        return key;
      });
      setValues(tempValues);
    };
    getValues();
    return;
  }, [params.table, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:${port}/create/${params.table.toString()}`, {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    });
    navigate(`/view/${params.table.toString()}`);
  };

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

  return (
    <div>
      <div className="header container-fluid">
        <Link className="header-link" to={`/view/${params.table.toString()}`}>
          Назад
        </Link>
      </div>
      <div style={{ margin: "0px 15px 0px 15px" }}>
        <form onSubmit={onSubmit}>
          {displayKeysAndValues()}
          <div className="form-group">
            <input
              type="submit"
              value="Создать запись"
              style={{ marginTop: "15px" }}
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRecord;
