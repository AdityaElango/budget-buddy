import React,{useState, useContext, useEffect, useRef, useMemo} from 'react';
import "./signup.css";
import {Link, useNavigate} from "react-router-dom";
import { ToastContext } from "../Toast/ToastProvider";
import { LoginContext } from "../Context/Context";
import { signup as signupApi, login as loginApi, validateUser as validateUserApi } from "../../api/authApi";

const Signup = () => {
  const history = useNavigate();
  const { showToast } = useContext(ToastContext);
  const { setLoginData } = useContext(LoginContext);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MIN_PASSWORD_LENGTH = 6;
  const nameRegex = /^[A-Za-z]+$/;

  const [passShow, setPassShow] = useState(false);
  const [cpassShow, setCPassShow] = useState(false);
  const [error, setError] = useState(false);
  const [pass, setPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nameInputRef = useRef(null);

  const [inpval, setInpval] = useState({
    fname:"",
    email:"",
    password:"",
    cpassword:""
  })

  useEffect(() => {
    nameInputRef.current?.focus();
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

  const passwordStrength = useMemo(() => {
    const pwd = inpval.password;
    if (!pwd) return { label: "Add a password", level: "empty" };
    const hasLength = pwd.length >= MIN_PASSWORD_LENGTH;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const checks = [hasLength, hasUpper, hasLower, hasNumber].filter(Boolean).length;

    if (pwd.length >= 10 && checks >= 3) return { label: "Strong", level: "strong" };
    if (hasLength && checks >= 2) return { label: "Medium", level: "medium" };
    return { label: "Weak", level: "weak" };
  }, [inpval.password]);

  const fieldErrors = useMemo(() => {
    const errs = {};
    if (!inpval.fname) {
      errs.fname = "Name is required";
    } else if (!nameRegex.test(inpval.fname)) {
      errs.fname = "Use letters only";
    }

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

    if (!inpval.cpassword) {
      errs.cpassword = "Confirm your password";
    } else if (inpval.password !== inpval.cpassword) {
      errs.cpassword = "Passwords do not match";
    }

    return errs;
  }, [inpval, emailRegex, nameRegex]);

  const isFormValid = useMemo(() => Object.keys(fieldErrors).length === 0, [fieldErrors]);

  const addUserdata = async(e) =>{
    e.preventDefault();

    const {fname,email,password,cpassword} = inpval;

    if (!isFormValid) {
      setError("Please fix the highlighted fields");
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      // Step 1: Sign up the user
      const signupRes = await signupApi(fname, email, password, cpassword);
      
      if(signupRes.status === 201){
        setPass("User Registration Done");
        showToast("Signup successful! Logging you in...","success");
        
        // Step 2: Automatically log in the user
        const loginRes = await loginApi(email, password);
        
        if(loginRes.status === 201){
          // Save email and token
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem("usersdatatoken", loginRes.result.token);
          
          // Validate user and update context so ProtectedRoute works
          try {
            const userData = await validateUserApi();
            if (userData?.status === 201) {
              setLoginData(userData);
            }
          } catch (validationErr) {
            console.error("Validation error:", validationErr);
          }
          
          setInpval({...inpval,fname:"", email:"", password:"", cpassword:""})
          // Redirect to dashboard
          setTimeout(() => {
            history("/dash");
          }, 500);
        } else {
          // Signup succeeded but auto-login failed, redirect to login page
          showToast("Account created! Please log in.","success");
          setTimeout(() => {
            history("/login");
          }, 1000);
        }
      } else {
        setError(signupRes.message || "Signup failed");
        showToast(signupRes.message || "Signup failed","error");
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
            <h1>Create Account</h1>
            <p className="subtitle">Start your journey to better financial management</p>
          </div>
          <form onSubmit={addUserdata}>
          <div className="form_input">
              <label htmlFor="email">Name</label>
              <div className="two">
                <input
                  type="text"
                  ref={nameInputRef}
                  onChange = {setVal}
                  value={inpval.fname}
                  name="fname"
                  id="fname"
                  placeholder="Enter Your Name"
                />
              </div>
              {fieldErrors.fname && <p className="inline_error">{fieldErrors.fname}</p>}
            </div>
            <div className="form_input">
              <label htmlFor="email">Email</label>
              <div className="two">
                <input
                  type="email"
                  onChange = {setVal}
                  value={inpval.email}
                  name="email"
                  id="email"
                  placeholder="Enter Your Email"
                />
              </div>
              {fieldErrors.email && <p className="inline_error">{fieldErrors.email}</p>}
            </div>
            <div className="form_input">
              <label htmlFor="email">Password</label>
              <div className="two">
                <input
                  type={!passShow ? "password" : "text"}
                  onChange = {setVal}
                  value={inpval.password}
                  name="password"
                  id="password"
                  placeholder="Enter Your Password"
                />
                <div className="showpass" onClick={()=>setPassShow(!passShow)}>
                  {!passShow ? "Show" : "Hide"}</div>
              </div>
              {inpval.password && (
                <div className={`strength_meter ${passwordStrength.level}`}>
                  <div className="strength_bar" />
                  <span className="strength_label">Password strength: {passwordStrength.label}</span>
                </div>
              )}
              {fieldErrors.password && <p className="inline_error">{fieldErrors.password}</p>}
            </div>
            <div className="form_input">
              <label htmlFor="email">Confirm Password</label>
              <div className="two">
                <input
                  type={!cpassShow ? "password" : "text"}
                  onChange = {setVal}
                  value={inpval.cpassword}
                  name="cpassword"
                  id="cpassword"
                  placeholder="Enter Your Password"
                />
                <div className="showpass" onClick={()=>setCPassShow(!cpassShow)}>
                  {!cpassShow ? "Show" : "Hide"}</div>
              </div>
              {fieldErrors.cpassword && <p className="inline_error">{fieldErrors.cpassword}</p>}
            </div>
            {error && <div className="error_msg">{error}</div>}
            {pass && <div className="pass_msg">{pass}</div>}
            <button className="btn" type="submit" disabled={isLoading || !isFormValid}>
              {isLoading ? (
                <span className="spinner"></span>
              ) : (
                "Create Account"
              )}
            </button>
            <p>Already have an account? <Link to ="/login">Login</Link></p>
            <Link to="/" className="back-to-home">← Back to Home</Link>
          </form>
        </div>
    </section>
    </>
  )
}

export default Signup
