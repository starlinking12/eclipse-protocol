import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export const TradingViewChart = () => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#DDD' },
      grid: { vertLines: { color: '#2a2a3a' }, horzLines: { color: '#2a2a3a' } },
      width: chartContainerRef.current.clientWidth,
      height: 360,
      timeScale: { timeVisible: true }
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
      wickUpColor: '#26a69a', wickDownColor: '#ef5350'
    });

    let price = 3500;
    const data = [];
    for (let i = 0; i < 100; i++) {
      const change = (Math.random() - 0.5) * 60;
      price += change;
      data.push({
        time: Math.floor(Date.now() / 1000) - (100 - i) * 3600,
        open: price - change/2,
        high: price + Math.abs(change),
        low: price - Math.abs(change),
        close: price
      });
    }
    candleSeries.setData(data);

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  return <div ref={chartContainerRef} className="w-full h-full" />;
};