import React,{useState, useEffect, useContext, useRef, useMemo} from 'react';
import {Link , useNavigate} from "react-router-dom";
import "./login.css";
import { ToastContext } from "../Toast/ToastProvider";
import { LoginContext } from "../Context/Context";
import { login as loginApi, validateUser as validateUserApi } from "../../api/authApi";

const Login = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_PASSWORD_LENGTH = 6;

  const history = useNavigate();
  const { showToast } = useContext(ToastContext);
  const { setLoginData } = useContext(LoginContext);

  const [passShow, setPassShow] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const emailInputRef = useRef(null);

  const [inpval, setInpval] = useState({
    email:"",
    password:""
  })

  // Load remembered email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setInpval(prev => ({ ...prev, email: savedEmail }));
    }
    emailInputRef.current?.focus();
  }, []);

  const setVal = (e)=>{
    //console.log(e.target.value);
    const {name,value} = e.target;

    setInpval(()=>{
      return{
        ...inpval,
        [name]:value

      }
    })
  }

  const fieldErrors = useMemo(() => {
    const errs = {};
    if (!inpval.email) {
      errs.email = "Email is required";
    } else if (!emailRegex.test(inpval.email)) {
      errs.email = "Enter a valid email";
    }

    if (!inpval.password) {
      errs.password = "Password is required";
    } else if (inpval.password.length < MIN_PASSWORD_LENGTH) {
      errs.password = `At least ${MIN_PASSWORD_LENGTH} characters`;
    }

    return errs;
  }, [inpval, emailRegex]);

  const isFormValid = useMemo(() => Object.keys(fieldErrors).length === 0, [fieldErrors]);

  const loginuser = async(e) =>{
    e.preventDefault();

    const {email,password} = inpval;

    if (!isFormValid) {
      setError("Please fix the highlighted fields");
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      const res = await loginApi(email, password);
      console.log(res);

      if(res.status === 201){
        // Remember email for next login
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem("usersdatatoken", res.result.token);
        
        // Validate user and update context so ProtectedRoute works
        try {
          const userData = await validateUserApi();
          if (userData?.status === 201) {
            setLoginData(userData);
          }
        } catch (validationErr) {
          console.error("Validation error:", validationErr);
        }
        
        showToast("Logged in successfully","success");
        history("/dash");
        setInpval({...inpval,email:"", password:""});
      } else {
        const errorMsg = res.error || res.message || "Login failed";
        setError(errorMsg);
        showToast(errorMsg,"error");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      showToast("An error occurred. Please try again.","error");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
    <section>
    <div className="form_data">
          <div className="form_heading">
            <h1>Login</h1>
          </div>
          <form onSubmit={loginuser}>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <div className="two">
                <input
                  type="email"
                  onChange={setVal}
                  value = {inpval.email}
                  name="email"
                  id="email"
                  placeholder="Enter Your Email"
                  ref={emailInputRef}
                />
              </div>
              {fieldErrors.email && <p className="inline_error">{fieldErrors.email}</p>}
            </div>
            <div className="form_input">
              <label htmlFor="email">Password</label>
              <div className="two">
                <input
                  type={!passShow ? "password" : "text"}
                  onChange={setVal}
                  value = {inpval.password}
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                />
                <div className="showpass" onClick={()=>setPassShow(!passShow)}>
                  {!passShow ? "Show" : "Hide"}</div>
              </div>
              {fieldErrors.password && <p className="inline_error">{fieldErrors.password}</p>}
            </div>
            {error && <div className="error_msg">{error}</div>}
            <button className="btn" type="submit" disabled={isLoading || !isFormValid}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Login"
              )}
            </button>
            <p>Don't have an account <Link to ="/signup">Sign up</Link></p>
          </form>
        </div>
    </section>
    </>
  )
}

export default Login
