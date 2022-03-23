import React, { useEffect } from "react";
import "./App.css";
import { getNASAPictures } from "./NasaAPI";
import moment from "moment";

function App() {
  const [pictures, updatePictures] = React.useState(null);
  const [rowData, updateRowData] = React.useState(null);
  const [dateOfFilter, setDateOfFilter] = React.useState(null);
  useEffect(() => {
    if (!pictures) {
      const startDate = new Date("2022-01-01T08:28:41.917Z");
      // const startDate = new Date("2022-02-20T08:28:41.917Z");
      const endDate = new Date();
      getNASAPictures(startDate, endDate).then((res) => {
        let filtered = res.filter((image) => image.media_type === "image");
        updateRowData(filtered);
        updatePictures(spliter(filtered, 3));
      });
    }
  }, [pictures]);
  useEffect(() => {
    if (pictures) {
      const startDateOfFilter = moment().subtract(+dateOfFilter, "days");
      const today = moment();
      const fil = rowData.filter((pic) => {
        if (moment(pic.date).isBetween(startDateOfFilter, today, "day", "[]"))
          return pic;
      });
      if (dateOfFilter === "") updatePictures(spliter(rowData, 3));
      else updatePictures(spliter(fil, 3));
    }
  }, [dateOfFilter]);
  let subArrays = [];
  function spliter(array, chunkSize) {
    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);
      // do whatever
      console.log();
      subArrays.push(chunk);
    }
    return subArrays;
  }
  return (
    <div className="container App" style={{ marginTop: 20 }}>
      <div>
        <select
          class="form-select"
          aria-label="Default select example"
          onChange={(v) => {
            setDateOfFilter(v.target.value);
          }}
        >
          <option value="" selected>
            Open this select menu
          </option>
          <option value="7">last week</option>
          <option value="14">last two weeks</option>
          <option value="30">last month</option>
        </select>
      </div>

      {pictures &&
        pictures.map((pictureArr) => (
          <div className="row my-4">
            {pictureArr.map((pic) => {
              return (
                <div className="col-md-4">
                  <div className="imageBox">
                    <p className="imageBoxDate">{pic?.date}</p>
                    <img style={{ width: "100%", height: 250 }} src={pic.url} />
                    <div class="d-flex justify-content-between p-3">
                      <h5>{pic?.title}</h5>
                      <span>{pic?.copyright || ""}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}

export default App;
