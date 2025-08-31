import { useRef, useState, useEffect, use } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "./api/axios";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register() {
  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchpwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const result = USER_REGEX.test(user);
    console.log(result);
    console.log(user);
    setValidName(result);
  }, [user]);

  useEffect(() => {
    const result = PWD_REGEX.test(pwd);
    console.log(result);
    console.log(user);
    setValidPwd(result);
    const match = matchpwd === pwd;
    setValidMatch(match);
  }, [pwd, matchpwd]);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd, matchpwd]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!USER_REGEX.test(user) || !PWD_REGEX.test(pwd)) {
      setErrMsg("Invalid Entry");
      return;
    }

    try {
      const postOpt = {
        headers: { "Content-Type": "application/json" },
        withCredentioals: true,
      };
      const response = await axios.post(
        "/register",
        JSON.stringify({ user, pwd }),
        postOpt
      );
      console.log(response.data);
      setSuccess(true);
    } catch (err) {
      if (!err?.response) setErrMsg("No Server Response");
      else if (err.response?.status === 409) setErrMsg("Username Taken");
      else setErrMsg("Registration Failed");
      errRef.current.focus();
    }
  }

  return (
    <>
      {success ? (
        <section className="form-content">
          <h1>Success!</h1>
          <p className="success-sign-in">
            <a href="/">Sign In</a>
          </p>
        </section>
      ) : (
        <section className="form-content">
          <div className="err-msg-content">
            <p
              ref={errRef}
              className={errMsg ? "err-msg" : "off-screen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>
          </div>
          <h1>Register</h1>

          <form onSubmit={handleSubmit}>
            <label htmlFor="username">
              Username:
              <span className={validName ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validName || !user ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="text"
              id="username"
              required
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setUser(e.target.value)}
              aria-invalid={validName ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <p
              id="uidnote"
              className={
                userFocus && user && !validName ? "instruction" : "off-screen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} />
              {"  "}4 to 24 characters. <br />
              Must begin with letter.
              <br />
              Letters, Numbers, underscores, hyphens allowed.
            </p>

            <label htmlFor="password">
              Password:
              <span className={validPwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validPwd || !pwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="password"
              required
              onChange={(e) => setPwd(e.target.value)}
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <p
              id="pwdnote"
              className={pwdFocus && !validPwd ? "instruction" : "off-screen"}
            >
              <FontAwesomeIcon icon={faInfoCircle} /> 8 to 24 characters. <br />
              Must include uppercase and lowercase letters, a number and an
              special character. <br />
              Allowed special characters:
              <span aria-label="exclamation mark">!</span>
              <span aria-label="at symbol">@</span>
              <span aria-label="hashtag">#</span>
              <span aria-label="dollar sign">$</span>
              <span aria-label="percent">%</span>
            </p>

            <label htmlFor="confirm-pwd">
              Confirm Password:
              <span className={validMatch && matchpwd ? "valid" : "hide"}>
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <span className={validMatch || !matchpwd ? "hide" : "invalid"}>
                <FontAwesomeIcon icon={faTimes} />
              </span>
            </label>
            <input
              type="password"
              id="confirm-pwd"
              required
              autoComplete="off"
              onChange={(e) => setMatchPwd(e.target.value)}
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="matchpwdnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <p
              id="confirmnote"
              className={
                matchFocus && !validMatch ? "instruction" : "off-screen"
              }
            >
              <FontAwesomeIcon icon={faInfoCircle} /> Must match the first
              password input field
            </p>
            <button
              disabled={!validName || !validPwd || !validMatch ? true : false}
            >
              Sign Up
            </button>
            <p className="sign-in">
              Already registered? <br />
              <span className="line">
                <a href="/" className="line-link">
                  Sign In
                </a>
              </span>
            </p>
          </form>
        </section>
      )}
    </>
  );
}
