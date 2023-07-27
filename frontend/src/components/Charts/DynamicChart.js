import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';

export default function DynamicChart() {
  const [Data, setData] = useState([]);
  const data = {
    labels: Data.map((o) => o.name), // first change
    datasets: [
      {
        label: 'Books Prices',
        fill: false,
        lineTension: 0.0,
        backgroundColor: 'rgb(41, 33, 116,0.5)',
        borderColor: 'rgb(41, 33, 116,0.5)',
        pointHitRadius: 20,
        data: Data.map((o) => parseFloat(o.price)), // second change
      },
    ],
  };

  useEffect(() => {
    const fetcchAllProducts = async () => {
      try {
        const res = await axios.get(
          'http://localhost:9000/api/products/listforAdmin'
        );
        console.log(res.data);
        setData(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllProducts();
  }, []);

  return (
    <div className="chart">
      <h1>Prix des Livres</h1>
      <Bar data={data} />
    </div>
  );
}
