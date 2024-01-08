import agent from "../agent";
import Header from "./Header";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { APP_LOAD, REDIRECT } from "../constants/actionTypes";
import Item from "./Item";
import Editor from "./Editor";
import Home from "./Home";
import Login from "./Login";
import Profile from "./Profile";
import ProfileFavorites from "./ProfileFavorites";
import Register from "./Register";
import Settings from "./Settings";
import { Route, Routes, useNavigate, Navigate } from "react-router-dom";

const PrivateRoute = ({ children, userAuthenticated }) => {
  return userAuthenticated ? children : <Navigate to="/login"/>;
}

const isTokenExpired = (token) => {
  const [, payload,] = token.split('.');
  const decodedPayload = JSON.parse(atob(payload));
  const expirationTime = decodedPayload.exp;
  const expirationDate = new Date(expirationTime * 1000);
  return expirationDate < new Date();
}

const mapStateToProps = (state) => {
  return {
    appLoaded: state.common.appLoaded,
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo,
  };
};

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload, token) =>
    dispatch({ type: APP_LOAD, payload, token, skipTracking: true }),
  onRedirect: () => dispatch({ type: REDIRECT }),
});

const App = (props) => {
  const { redirectTo, onRedirect, onLoad } = props;
  const navigate = useNavigate();

  useEffect(() => {
    if (redirectTo) {
      navigate(redirectTo);
      onRedirect();
    }
  }, [redirectTo, onRedirect, navigate]);

  const token = window.localStorage.getItem("jwt");
  useEffect(() => {
    if (token) {
      if (isTokenExpired(token)) {
        navigate(`/login`);
      }
      agent.setToken(token);
    }
    onLoad(token ? agent.Auth.current() : null, token);
  }, [onLoad]);


  if (props.appLoaded) {
    return (
      <div>
        <Header
          appName={props.appName}
          currentUser={props.currentUser}
        />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/editor/:slug" element={<Editor/>} />
          <Route path="/editor" element={<Editor/>} />
          <Route path="/item/:id" element={<Item/>} />
          <Route path="/settings"
                 element={
                   <PrivateRoute userAuthenticated={!!props.currentUser}>
                     <Settings/>
                   </PrivateRoute>
                 }/>
          <Route path="/:username/favorites" element={<ProfileFavorites/>} />
          <Route path="/:username" element={<Profile/>} />
        </Routes>
      </div>
    );
  }
  return (
    <div>
      <Header
        appName={props.appName}
        currentUser={props.currentUser}
      />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
