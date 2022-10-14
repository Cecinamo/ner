import { useColorModeValue } from '@chakra-ui/react';
import { BarDatum, BarSvgProps, ResponsiveBar } from '@nivo/bar';
import { getAxisTooltip } from './constants';

export function Bar({ data, ...rest }: BarProps) {
  const textColor = useColorModeValue('#222222', '#C9C9C9');
  const gridColor = useColorModeValue('#ddd', '#444');
  const k = Object.keys(data);
  const distro = k.map((kk) => {var obj = {};
                                  obj['id'] = kk;
                                  obj[kk] = data[kk];
                                  return obj});
  const theme = {
      fontSize: '14px',
      textColor: '#A9A9A9'
    };
  console.log(k);
  console.log(distro);
  return (
    <ResponsiveBar
      data={distro}
      keys={k}
      theme={theme}
      colors={['#800000']}
      borderRadius={"10"}
      margin={{
          top: 10,
          right: 10,
          bottom: 80,
          left: 50
        }}
      enableGridY={false}
      layout='horizontal'
    />
  );
}
