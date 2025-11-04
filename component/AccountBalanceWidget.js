import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

/**
 * @component ProjectProgressWidget
 * @description ویجت نمایش پیشرفت پروژه با نمودار S-Curve
 */
function ProjectProgressWidget({ data }) {
  const theme = useTheme()
  const [chartKey, setChartKey] = useState(0)

  // استخراج داده‌ها
  const actualProgress = data?.actualProgress || 0
  const plannedProgress = data?.plannedProgress || 0
  const progressData = data?.progress || []
  const progressCalculationType = data?.progressCalculationType

  // تبدیل داده‌های progress به فرمت نمودار
  const generateChartSeries = () => {
    if (!progressData.length) return []

    // سری داده برای پیشرفت برنامه‌ای (کامل)
    const plannedSeries = progressData.map((item) => ({
      x: new Date(item.date).getTime(),
      y: Number(item.plan.toFixed(2)),
    }))

    // سری داده برای پیشرفت واقعی (تا جایی که مقدار actual برابر actualProgress است)
    const actualSeries = []
    for (let i = 0; i < progressData.length; i++) {
      const item = progressData[i]
      actualSeries.push({
        x: new Date(item.date).getTime(),
        y: Number(item.actual.toFixed(2)),
      })

      // اگر به آخرین مقدار actualProgress رسیدیم، متوقف شو
      if (item.actual >= actualProgress) {
        break
      }
    }

    return [
      {
        name: 'پیشرفت برنامه‌ای',
        data: plannedSeries,
      },
      {
        name: 'پیشرفت واقعی',
        data: actualSeries,
      },
    ]
  }

  const series = generateChartSeries()

  // برای انیمیشن، وقتی data تغییر می‌کند، key را تغییر بده
  useEffect(() => {
    setChartKey((prev) => prev + 1)
  }, [data])

  const chartOptions = {
    chart: {
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      width: '100%',
      height: '100%',
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.grey[400], theme.palette.primary.main],
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.5,
        gradientToColors: [theme.palette.grey[200], theme.palette.primary.light],
        inverseColors: false,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      x: {
        format: 'yyyy/MM/dd',
      },
      y: {
        formatter: (value) => `${value}%`,
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM yyyy',
          day: 'dd MMM',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        formatter: (value) => `${value}%`,
      },
      min: 0,
      max: 100,
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'right',
      fontFamily: 'inherit',
      labels: {
        colors: theme.palette.text.primary,
      },
      markers: {
        width: 10,
        height: 10,
        radius: 2,
      },
      itemMargin: {
        horizontal: 12,
        vertical: 8,
      },
    },
  }

  return (
    <Paper className='flex flex-col flex-auto shadow rounded-2xl overflow-hidden'>
      <div className='flex flex-col p-24 pb-16'>
        <div className='flex items-start justify-between'>
          <div className='flex flex-col'>
            <Typography className='mr-16 text-lg font-medium tracking-tight leading-6 truncate'>
              پیشرفت پروژه
            </Typography>
            <Typography className='font-medium' color='text.secondary'>
              مقایسه پیشرفت واقعی و برنامه‌ای پروژه
            </Typography>
          </div>

          <div className=''>
            {progressCalculationType === 'weekly' && (
              <Chip size='small' className='font-medium text-sm' label='هفتگی' />
            )}
          </div>
        </div>
        <div className='flex items-start mt-24 mr-8'>
          <div className='flex flex-col'>
            <Typography className='font-semibold text-3xl md:text-5xl tracking-tighter'>
              {actualProgress.toFixed(1)}%
            </Typography>
            <Typography className='font-medium text-sm leading-none' color='text.secondary'>
              پیشرفت واقعی
            </Typography>
          </div>
          <div className='flex flex-col ml-32 md:ml-64'>
            <Typography className='font-semibold text-3xl md:text-5xl tracking-tighter'>
              {plannedProgress.toFixed(1)}%
            </Typography>
            <Typography className='font-medium text-sm leading-none' color='text.secondary'>
              پیشرفت برنامه‌ای
            </Typography>
          </div>
        </div>
      </div>
      <div className='flex flex-col flex-auto' style={{ minHeight: 300 }}>
        {series.length > 0 ? (
          <ReactApexChart
            key={chartKey}
            className='flex-auto w-full h-full'
            options={chartOptions}
            series={series}
            type='area'
            height='100%'
          />
        ) : (
          <div className='flex items-center justify-center h-full'>
            <Typography color='text.secondary'>داده‌ای برای نمایش وجود ندارد</Typography>
          </div>
        )}
      </div>
    </Paper>
  )
}

export default ProjectProgressWidget
