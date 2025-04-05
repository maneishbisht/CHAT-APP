import React from 'react'
import{Line,Doughnut} from "react-chartjs-2";
import { orange, purple, purpleLight,matBlack } from '../../constants/color';
import {CategoryScale, Chart as ChartJS, Tooltip,Filler,LinearScale,PointElement,LineElement,ArcElement,Legend} from "chart.js";
import { getLast7Days } from '../../lib/features';

ChartJS.register(CategoryScale,Tooltip,Filler,LinearScale,PointElement,LineElement,ArcElement,Legend)


const labels = getLast7Days();


const lineChartOptions = {

  responsive : true,

  plugins : {
    legend : {
      display : false,
    },
    title : {
      display : false,
    },
  },

  scale : {
    x : {
    beginAtZero : true
    },
    y : {
      beginAtZero : true
    },
  },

}


const DoughnutChartOptions = {

  responsive : true,

  plugins : {
    legend : {
      display : false,
    },
    title : {
      display : false,
    },
  },

  cutout : 120,

  scale : {
    x : {
    beginAtZero : true,
    grid : { display : false}
    },
    y : {
      beginAtZero : true,
      grid : {display : false}
    },
  },

}





const LineChart = ({value=[]})=>{
  
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label : "Messages",
        fill : true,
        backgroundColor : purpleLight,
        borderColor : purple
      },
    ],
  };


return(
  <Line data = {data} options = {lineChartOptions}/>
)

}


const DoughnutChart = ({value=[],labels = []})=>{

  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor : [purpleLight,orange],
        borderColor : [purple,orange],
        offset : 30
      },
    ],
  };
  
  return (
      <Doughnut  style = {{zIndex : 10}} data = {data} options = {DoughnutChartOptions}></Doughnut>
  )
}

export {LineChart,DoughnutChart};