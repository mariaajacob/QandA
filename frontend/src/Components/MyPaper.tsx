import { Theme, createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

export const MyPaper = withStyles({
    root: {
        borderRadius: '0px 0px 30px 30px'
    }
})(Paper);
//   createStyles({
//     root: {
//       display: 'flex',
//       flexWrap: 'wrap',
//       borderRadius: '0px 0px 10px, 10px',
//       borderTop: '3px solid',
//       '& > *': {
//         margin: theme.spacing(1),
//         width: theme.spacing(16),
//         height: theme.spacing(16),
//       },
//     },
//   }),
// );

// export const BootstrapButton = withStyles({
//     root: {
//       textTransform: 'none',
//       color: '#ffffff',
//       padding: '6px 12px',
//       lineHeight: 1.5,
//       background: 'linear-gradient(45deg, rgb(82, 150, 94) 30%, rgb(113, 201, 128) 90%)',
//       boxShadow: '0 3px 5px 0 rgba(0, 0, 0, 0.16)',
//       cursor: 'pointer',
//       fontFamily: 'Segoe UI',
//       borderRadius: '10px',
//       '&:hover': {
//         background: 'linear-gradient(45deg, rgb(103, 185, 118) 30%, rgb(182, 233, 135) 90%)',
//       },
//       '&:active': {
//         boxShadow: 'none',
//         background: 'linear-gradient(45deg, rgb(82, 150, 94) 30%, rgb(182, 233, 135) 90%)',
//       }
//     },
//   })(Button);

// export default function MyPaper() {
//   const classes = useStyles();
//   return (
//     <div className={classes.root}>
//       <Paper elevation={0} />
//       <Paper />
//       <Paper elevation={3} />
//     </div>
//   );
// }