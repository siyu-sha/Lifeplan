import React, { Component } from "react";
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";

import ReactEcharts from "echarts-for-react";

class ConsumableChart extends Component {
  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("SocialParticipation"));
    // 绘制图表
    var Option = {
      color: ["#0C82E5"],
      grid: {
        show: false,
        backgroundColor: "#EBD1CC"
      },
      title: {
        text: "",
        subtext: "",
        x: "center",
        y: "center",
        textStyle: {
          color: "#fff",
          fontSize: 35
        },
        subtextStyle: {
          color: "#fff",
          fontSize: 20
        }
      },
      series: [
        {
          name: "Consumable",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          clockwise: true,
          labelLine: {
            normal: {
              show: false
            }
          },
          label: {
            normal: {
              show: false
            }
          },
          // itemStyle : labelFromatter,
          data: [
            {
              value: 2000,
              name: "money used"
            },
            {
              value: 2000,
              name: "money left",
              itemStyle: {
                normal: {
                  color: "#80B4E0"
                }
              }
            },
            {
              value: 2000,
              name: "money left",
              itemStyle: {
                normal: {
                  color: "#D5CECD"
                }
              }
            }
          ]
        }
      ]
    };

    myChart.setOption(Option);
  }
  render() {
    return <div id="SocialParticipation" style={{ width: 125, height: 125 }} />;
  }
}

export default ConsumableChart;
