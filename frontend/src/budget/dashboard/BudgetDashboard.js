import React from "react";
import BudgetCategorySection from "./BudgetCategorySection";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { CardContent } from "@material-ui/core";

const MAX_AMOUNT = 10000;

function generateData() {
  const mainGroups = {
    coreSupports: ["Core Supports"],
    capital: ["Assistive Technology", "Home Modifications"],
    capacityBuilding: [
      "Coordination of Supports",
      "Improved Living Arrangements",
      "Increased Social and Community Participation",
      "Finde and Keep a Job",
      "Improved Relationships",
      "Improved Health and Wellbeing",
      "Improved Learning",
      "Improved Life Choices",
      "Improved Daily Living"
    ]
  };
  let data = { coreSupports: [], capital: [], capacityBuilding: [] };
  mainGroups.coreSupports.map(value => {
    const maxAmount = Math.round(Math.random() * MAX_AMOUNT * 100) / 100;
    const allocatedAmount = Math.round(Math.random() * maxAmount * 100) / 100;
    const color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    ];
    data.coreSupports.push({
      category: value,
      total: maxAmount,
      allocated: allocatedAmount,
      totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
      allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
    });
  });
  mainGroups.capital.map(value => {
    const maxAmount = Math.round(Math.random() * MAX_AMOUNT * 100) / 100;
    const allocatedAmount = Math.round(Math.random() * maxAmount * 100) / 100;
    const color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    ];
    data.capital.push({
      category: value,
      total: maxAmount,
      allocated: allocatedAmount,
      totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
      allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
    });
  });
  mainGroups.capacityBuilding.map(value => {
    const maxAmount = Math.round(Math.random() * MAX_AMOUNT * 100) / 100;
    const allocatedAmount = Math.round(Math.random() * maxAmount * 100) / 100;
    const color = [
      Math.random() * 255,
      Math.random() * 255,
      Math.random() * 255
    ];
    data.capacityBuilding.push({
      category: value,
      total: maxAmount,
      allocated: allocatedAmount,
      totalColor: `rgba(${color[0]},${color[1]},${color[2]},1)`,
      allocatedColor: `rgba(${color[0]},${color[1]},${color[2]},0.5)`
    });
  });

  return data;
}

export default function BudgetDashBoard() {
  const data = generateData();
  return (
    <div className="root">
      <Grid container justify="center">
        <Grid item xs={12} md={11} xl={10}>
          <Card>
            <CardContent>hi</CardContent>
          </Card>
          <BudgetCategorySection
            sectionName="Core Supports"
            categories={data.coreSupports}
          />
          <BudgetCategorySection
            sectionName="Capital"
            categories={data.capital}
          />
          <BudgetCategorySection
            sectionName="Core Supports"
            categories={data.capacityBuilding}
          />
        </Grid>
      </Grid>
    </div>
  );
}
