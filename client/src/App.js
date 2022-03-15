import React from "react";
import { Route, Routes } from "react-router-dom";
import TableList from "./components/tableList";
import TableView from "./components/tableView";
import RecordView from "./components/recordView";
import CreateRecord from "./components/createRecord";
import CreateTable from "./components/createTable";

function App() {
  return (
    <div>
      <Routes>
        <Route exact path="/" element={<TableList></TableList>}></Route>
        <Route
          path="/table/create"
          element={<CreateTable></CreateTable>}
        ></Route>
        <Route path="/view/:table" element={<TableView></TableView>}></Route>
        <Route
          path="/view/:table/:id"
          element={<RecordView></RecordView>}
        ></Route>
        <Route
          path="/create/:table"
          element={<CreateRecord></CreateRecord>}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
