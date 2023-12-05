import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function Car() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [values, setValues] = useState({
    make: "",
    model: "",
    year: "",
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
            year: data.year,
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
    <div style={styles.container}>
      <Link to="/" style={styles.center}>
        {" "}
        Back to Dashboard{" "}
      </Link>
      <div style={styles.card}>
        <h1>Car Profile</h1>
        <h3>
          {values && values.year} {values && values.make}{" "}
          {values && values.model}
        </h3>
        {error && <p>{error}</p>}
        {loading && <p>Loading...</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label htmlFor="make">Make: </label>
            <input
              type="text"
              id="make"
              name="make"
              onChange={handleInputChanges}
              value={values.make}
            />
          </div>
          <div className="form-group">
            <label htmlFor="model">Model: </label>
            <input
              type="text"
              id="model"
              name="model"
              onChange={handleInputChanges}
              value={values.model}
            />
          </div>
          <div>
            <label htmlFor="year">Year: </label>
            <input
              type="text"
              id="year"
              name="year"
              onChange={handleInputChanges}
              value={values.year}
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
    </div>
  );
}

export default Car;

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    height: "100vh",
    background: "#f5f5f5",
  },
  card: {
    padding: "1rem",
    margin: "1rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "50%",
    textAlign: "center",
    background: "white",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },
  center: {
    textAlign: "center",
  },
};
