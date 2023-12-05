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
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>Cars In Database</h1>
        {error && <p>{error}</p>}
        {loading && <p>Loading...</p>}
        {cars && (
          <div>
            {cars.map((car) => (
              <Link key={car._id} to={`/car/${car._id}`}>
                <br />
                {car.year} {car.make} {car.model}
                <br />
              </Link>
            ))}
          </div>
        )}
      </div>
      <div style={styles.card}>
        <h1 style={styles.center}>Add Car</h1>
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
          <div>
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
          <button type="submit" onClick={handleSubmit}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Dashboard;

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "2rem",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  card: {
    backgroundColor: "white",
    padding: "1rem",
    paddingBottom: "2rem",
    borderRadius: "5px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
};
