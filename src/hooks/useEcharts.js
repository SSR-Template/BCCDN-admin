import * as echarts from "echarts";
import { watch } from "vue";

export default function useEcharts(dom, option) {
  let chart = null;

  watch(
    dom,
    val => {
      if (val) {
        chart = echarts.init(val);
        chart.setOption(option.value);
      }
    },
    { immediate: true }
  );

  watch(
    option,
    val => {
      chart?.setOption(val);
    },
    { deep: true }
  );
}
