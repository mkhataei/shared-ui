import { alpha } from '@mui/material'
import Chip from '@mui/material/Chip'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

function ProjectProgressWidget({
  projectName = '',
  category = '', // نوع زیرپروژه: TARH یا JARI
  actualProgress = 0,
  plannedProgress = 0,
  progressData = [],
  calculationType = 'monthly',
  subProjectId = '',
  onNavigate,
  modernBorder = false, // فعال‌سازی استایل بوردر مدرن
}) {
  const theme = useTheme()
  const [chartKey, setChartKey] = useState(0)

  const generateChartSeries = () => {
    if (!progressData.length) return []

    const plannedSeries = progressData.map((item) => ({
      x: item.shamsi, // استفاده از تاریخ شمسی برای محور X
      y: item.plan, // عدد دقیق بدون toFixed
      actual: item.actual, // ذخیره مقدار واقعی برای tooltip
    }))

    const actualSeries = []
    for (let i = 0; i < progressData.length; i++) {
      const item = progressData[i]
      actualSeries.push({
        x: item.shamsi,
        y: item.actual, // عدد دقیق بدون toFixed
        plan: item.plan, // ذخیره مقدار برنامه‌ای برای tooltip
      })
      if (item.actual >= actualProgress) break
    }

    return [
      { name: 'برنامه‌ای', data: plannedSeries },
      { name: 'واقعی', data: actualSeries },
    ]
  }

  const series = generateChartSeries()

  useEffect(() => {
    setChartKey((prev) => prev + 1)
  }, [projectName, actualProgress, plannedProgress, progressData])

  const handleClick = () => {
    if (onNavigate && subProjectId) {
      onNavigate(subProjectId)
    }
  }

  const chartOptions = {
    chart: {
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      width: '100%',
      height: '100%',
      type: 'line', // تغییر به line برای S-Curve
      toolbar: { show: false },
      zoom: { enabled: false },
      events: {
        click: handleClick,
      },
    },
    colors: [theme.palette.grey[500], theme.palette.primary.main],
    stroke: {
      curve: 'smooth',
      width: 4,
    },
    markers: {
      size: 0, // حذف نقاط
      hover: { size: 0 }, // حذف نقاط هنگام hover
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      shared: true, // نمایش هر دو سری در یک tooltip
      intersect: false,
      theme: 'dark',
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // فقط برای اولین سری tooltip را نمایش بده (جلوگیری از تکرار)
        if (seriesIndex !== 0) {
          return ''
        }

        const date = w.config.series[0].data[dataPointIndex]?.x || ''
        const plannedValue = w.config.series[0]?.data[dataPointIndex]?.y || 0
        const actualValue = w.config.series[1]?.data[dataPointIndex]?.y || 0

        let tooltipContent =
          '<div style="padding:10px 14px;background:#1e293b;border-radius:6px">' +
          '<div style="color:#94a3b8;font-size:11px;margin-bottom:8px;font-weight:500">' +
          date +
          '</div>'

        // همیشه برنامه‌ای را نشان بده
        tooltipContent +=
          '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">' +
          '<div style="width:8px;height:8px;border-radius:50%;background:' +
          theme.palette.grey[500] +
          '"></div>' +
          '<span style="color:#fff;font-weight:600;font-size:12px">برنامه‌ای: ' +
          plannedValue +
          '%</span>' +
          '</div>'

        // همیشه واقعی را نشان بده
        tooltipContent +=
          '<div style="display:flex;align-items:center;gap:8px">' +
          '<div style="width:8px;height:8px;border-radius:50%;background:' +
          theme.palette.primary.main +
          '"></div>' +
          '<span style="color:#fff;font-weight:600;font-size:12px">واقعی: ' +
          actualValue +
          '%</span>' +
          '</div>'

        tooltipContent += '</div>'
        return tooltipContent
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      borderColor: theme.palette.divider,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 10, right: 10, bottom: 0, left: 10 },
    },
    xaxis: {
      type: 'category', // تغییر به category برای تاریخ شمسی
      labels: {
        show: false, // مخفی کردن label های محور x
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.secondary, fontSize: '11px' },
        formatter: (value) => value + '%',
      },
      min: 0,
      max: 100,
    },
    legend: { show: false },
  }

  return (
    <Paper
      className='flex flex-col flex-auto shadow rounded-2xl overflow-hidden'
      elevation={modernBorder ? 0 : undefined}
      sx={{
        height: '100%',
        cursor: onNavigate ? 'pointer' : 'default',
        transition: modernBorder ? 'all 0.2s ease-in-out' : 'all 0.3s',
        ...(modernBorder && {
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }),
        '&:hover': onNavigate
          ? modernBorder
            ? {
                borderColor: 'primary.main',
                boxShadow: (theme) => `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
                transform: 'translateY(-4px)',
              }
            : {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              }
          : {},
      }}
      onClick={handleClick}
    >
      <div className='flex flex-col p-16 pb-12'>
        <div className='flex items-start justify-between mb-12'>
          <div className='flex flex-col'>
            <Typography className='text-base font-medium tracking-tight leading-6 truncate'>
              {projectName || 'پیشرفت پروژه'}
            </Typography>
            {category && (
              <Chip
                size='small'
                label={category === 'TARH' ? 'طرح' : 'جاری'}
                sx={{
                  mt: 0.5,
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  alignSelf: 'flex-start',
                  bgcolor: category === 'TARH' ? 'info.main' : 'success.main',
                  color: 'white',
                  '& .MuiChip-label': { px: 1 },
                }}
              />
            )}
          </div>
          <div>
            {calculationType === 'weekly' && (
              <Chip size='small' className='font-medium text-xs h-6' label='هفتگی' />
            )}
          </div>
        </div>
        <div className='flex items-center justify-end gap-12 -mr-6'>
          <div className='flex flex-col items-center'>
            <div className='flex items-center gap-2 mb-2'>
              <div
                className='w-2 h-2 rounded-full'
                style={{ backgroundColor: theme.palette.primary.main }}
              ></div>
              <Typography className='font-semibold text-2xl tracking-tight' color='text.primary'>
                {actualProgress}%
              </Typography>
            </div>
            <Typography className='font-medium text-xs' color='text.secondary'>
              پیشرفت واقعی
            </Typography>
          </div>
          <div className='w-px h-12 bg-gray-200'></div>
          <div className='flex flex-col items-center'>
            <div className='flex items-center gap-2 mb-2'>
              <div
                className='w-2 h-2 rounded-full'
                style={{ backgroundColor: theme.palette.grey[500] }}
              ></div>
              <Typography className='font-semibold text-2xl tracking-tight' color='text.primary'>
                {plannedProgress}%
              </Typography>
            </div>
            <Typography className='font-medium text-xs' color='text.secondary'>
              پیشرفت برنامه‌ای
            </Typography>
          </div>
        </div>
      </div>
      <div className='flex flex-col flex-auto' style={{ minHeight: 200, maxHeight: 280 }}>
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
            <Typography color='text.secondary' className='text-sm'>
              داده‌ای برای نمایش وجود ندارد
            </Typography>
          </div>
        )}
      </div>
    </Paper>
  )
}

export default ProjectProgressWidget
