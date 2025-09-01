import { Link, useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
export default function Login() {
  const navigate = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      setSuccess(true);
      navigate("/");
    } catch (err) {
      errRef.current.focus();
    }
  }

  return (
    <section className="form-content">
      <p className={errMsg ? "err-msg" : "off-screen"}>{errMsg}</p>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          required
          autoComplete="off"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        ></input>

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          required
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        ></input>
        <button>Sign In</button>
        <p>
          Need an Account? <br />
          <Link to="/">Sign Up</Link>
        </p>
      </form>
    </section>
  );
}
