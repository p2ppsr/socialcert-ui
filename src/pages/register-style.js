import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundImage: 'url(/images/DiscordCertBackground.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    height: 'height: 26em'
  },
  title: {
    paddingTop: '3em',
    paddingBottom: '5em'
  },
  form: {
    paddingTop: '0.5em',
    paddingBottom: '2em'
  },
  button: {
    paddingTop: '1.5em',
    paddingRight: '1.5em'
  },
  logo: {
    width: '23em',
    padding: '1.5em'
  }
}))

export default useStyles
