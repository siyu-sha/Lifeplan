import React from "react";
import { Doughnut } from "react-chartjs-2";
import { DARK_BLUE, LIGHT_BLUE } from "../common/theme";

export default function DoughnutBody(props) {
  const { allocated,categories,budgets, total } = props;
  const available = Math.round(100 * (total - allocated)) / 100;
  let colorset =["#efdecd", "#e32636", "#f0f8ff","#ffbf00", "#9966cc","#a4c639",
      "#cd9575", "#008000","#00ffff", "#4b5320", "#6e7f80", "#21abcd"]
    let colors = [];
  let labels = [];
  let overbudget = [];
  let underbudget = []

  if(available>0){
      underbudget.push(available)
      labels.push("available: "+Math.round(available/total*100) +'%  $'+ Math.round(available))
      colors.push(DARK_BLUE)
  }

  function onClick(e){

      console.log(e)
    }

  for(let i=0;i<budgets.length;i++){
      if(available>=0){
        labels.push(categories[i] +': '+Math.round(budgets[i]/total*100)+'%  $'+ Math.round(budgets[i]))
        underbudget.push(budgets[i])
      }else{
        labels.push(categories[i] +': '+Math.round(budgets[i]/allocated*100)+'% $'+ Math.round(budgets[i]))
        overbudget.push(budgets[i])
      }
      colors.push(colorset[i])
  }

  return (
    <Doughnut
      legend={{
        position: "right",
        top: '5%',
        orient:'vertical',
        onClick: () => {},
      }}
      data={{
        labels: labels,
        datasets: [
          {

            data: available >= 0 ? underbudget :overbudget,
            backgroundColor:
              available >= 0 ? colors : colors,
          },
        ],
      }}
      options={{
        tooltips: { enabled: false },
      }}
    />
  );
}
