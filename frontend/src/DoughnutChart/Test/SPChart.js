import React, { Component } from "react";
// 引入 ECharts 主模块
import echarts from "echarts/lib/echarts";

import ReactEcharts from "echarts-for-react";

class SPChart extends Component {
  componentDidMount() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("Consumable"));
    // 绘制图表
    var Option = {
      color: ["#7B0982"],
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
          name: "xx状况",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          hoverAnimation: false, //移动放大
          clockwise: true, //逆时针
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
              value: 30,
              name: "money used"
            },
            {
              value: 30,
              name: "money left",
              itemStyle: {
                normal: {
                  color: "#D28AF3"
                }
              }
            },
            {
              value: 20,
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
    return <div id="Consumable" style={{ width: 125, height: 125 }} />;
  }
}

export default SPChart;
