import { Route, Redirect } from 'react-router-dom'
import { USER_FIELD } from "./LoginComponent";

export { RequireAuth };

function RequireAuth({ component: Component, ...rest }) {
  return (
    <Route {...rest} render={props => {
      if (sessionStorage.getItem(USER_FIELD)) {
        return <Component {...props} />

      }
      return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
    }} />
  );
}