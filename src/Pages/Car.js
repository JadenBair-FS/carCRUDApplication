import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Car() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    make: "",
    model: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();

  const API_BASE =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/api/v1"
      : process.env.REACT_APP_BASE_URL;

  let ignore = false;
  useEffect(() => {
    if (!ignore) {
      getCar();
    }
    return () => {
      ignore = true;
    };
  }, []);

  const getCar = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/cars/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setValues({
            make: data.make,
            model: data.model,
          });
        });
    } catch (error) {
      setError(error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const updateCar = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/cars/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }).then(() => navigate("/"));
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/cars/${id}`, {
        method: "DELETE",
      }).then(() => navigate("/", { replace: true }));
    } catch (error) {
      setError(error.message || "Unexpected Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    updateCar();
  };

  const handleInputChanges = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div>
      <h1>Car Profile</h1>
      <h3>
        {values && values.make} {values && values.model}
      </h3>
      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}
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
        <button type="submit" className="btn btn-primary">
          Update Car
        </button>
        <button type="button" className="btn btn-danger" onClick={deleteCar}>
          Delete Car
        </button>
      </form>
    </div>
  );
}

export default Car;
