import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const [cars, setCars] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    make: "",
    model: "",
  });

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/api/v1"
      : process.env.REACT_APP_BASE_URL;

  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      getCars();
    }
    return () => {
      ignore = true;
    };
  }, []);

  const getCars = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/cars`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setCars(data);
          setLoading(false);
        });
    } catch (error) {
      setError(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const createCar = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/cars`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then(() => getCars());
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createCar();
  };

  const handleInputChanges = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="container">
      <h1>Cars</h1>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
      {cars && (
        <div className="list-group">
          {cars.map((car) => (
            <Link
              key={car._id}
              to={`/car/${car._id}`}
              className="list-group-item"
            >
              {car.make} {car.model}
            </Link>
          ))}
        </div>
      )}

      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <input
              type="text"
              className="form-control"
              id="make"
              name="make"
              onChange={handleInputChanges}
              value={values.make}
            />
          </div>
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              className="form-control"
              id="model"
              name="model"
              onChange={handleInputChanges}
              value={values.model}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;
