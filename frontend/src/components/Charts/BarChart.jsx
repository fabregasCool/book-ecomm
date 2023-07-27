import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

const BarChart = () => {
  //Déclaration de la variable qui va recevoir tous les utilisateurs
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetcchAllProducts = async () => {
      try {
        const res = await axios.get(
          'http://localhost:9000/api/products/listforAdmin'
        ); //Recupère tous les marques(brand)
        console.log(res.data);
        setProducts(res.data); //Mettre à jour les marques(brand)
      } catch (err) {
        console.log(err);
      }
    };
    fetcchAllProducts();
  }, []);

  const labels = ['January', 'February', 'March', 'April', 'May', 'June'];
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'My First dataset',
        data: [10, 10, 5, 2, 20, 30, 45],
        backgroundColor: [
          'red',
          'green',
          'yellow',
          'violet',
          'blue',
          'orange',
          'pink',
        ],
      },
    ],
  };
  return (
    <div>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
