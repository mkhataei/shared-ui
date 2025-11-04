import Download from '@mui/icons-material/Download'
import { Link } from '@mui/material'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'

const FileElement = ({ randomId }) => {
  const [file, setFile] = useState(null)

  useEffect(() => {
    axios({
      method: 'GET',
      url: `file/randomId/${randomId}`,
    })
      .then((resp) => {
        setFile(resp.data)
        // window.open(resp.data.url, '_blank')
      })
      .catch((error) => { })

    return () => {
      setFile(null)
    }
  }, [randomId])

  return (
    <Grid container spacing={2} alignItems='center'>
      <Grid item>
        <Link href={file?.url || '#'}>
          <Download />
        </Link>
      </Grid>

      <Grid item>
        <Grid container direction='column'>
          <Typography variant='caption' color='textSecondary'>
            {file?.name || 'بدون نام'}
          </Typography>
          <Typography variant='caption' color='textSecondary'>
            {`حجم فایل: ${file?.fileSize ? parseInt(file?.fileSize / 1024, 10) : 0} کیلوبایت`}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  )
}

FileElement.propTypes = {
  randomId: PropTypes.string.isRequired,
}

export default React.memo(FileElement)
