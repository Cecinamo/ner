import { useColorModeValue } from '@chakra-ui/react';
import { HeatMapDatum, HeatMapSvgProps, ResponsiveHeatMap } from '@nivo/heatmap';
import { getAxisTooltip } from './constants';


export function Heatmap({ data, labels, xLegend, yLegend, ...rest }: HeatmapProps) {

  const cm = [];
  data.forEach((row, i) => {
        const data_tmp = [];
        row.forEach((col, j) => {
            data_tmp[j] = {"x": labels[j], "y": col};
        });
        cm[i] = {"id": labels[i], "data": data_tmp};
        });

  const theme = {
      fontSize: '14px',
      textColor: '#A9A9A9'
    };

  return (
        <ResponsiveHeatMap
        data={cm}
        forceSquare={true}
        theme={theme}
        borderRadius={"10"}
        borderWidth={"8"}
        borderColor="#222222"
        margin={{
          top: 10,
          right: 10,
          bottom: 80,
          left: 50
        }}
        colors={{
            type: 'sequential',
            scheme: 'oranges'
        }}
        axisTop={null}
        axisBottom={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Predicted',
            legendOffset: 50,
            legendPosition: 'middle',
            format: (v) => getAxisTooltip(v),
        }}
        axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'True',
            legendPosition: 'middle',
            legendOffset: -50,
            format: (v) => getAxisTooltip(v),
        }}
        animate={true}
      />
  );
}
