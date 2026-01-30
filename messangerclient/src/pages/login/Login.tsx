import { useState } from "react";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import type { LoginValues } from "../../Service/interface";
import { useAuth } from "../../ProtectedRoute/AuthProvider";
import { toast } from "react-toastify";
import InputWithLabel from "../../components/component/InputWithLabel";
import Button from "../../components/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const { handleLogin } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid Email format")
      .required("Email is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik<LoginValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await handleLogin(values);
        toast.success(data.msg || "Login Successful");
        navigate("/chat");
      } catch (error: any) {
        toast.error(error?.response?.data?.detail || "Login failed");
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#EDEDED] px-4">
      <div className="w-full max-w-md p-6 md:p-8 bg-[#FFFFFF] rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#329A93] mb-6">
          Login
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex">
            <InputWithLabel
              placeholder="Email"
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? formik.errors.email : undefined}
            ></InputWithLabel>
          </div>

          <div className="flex">
            <InputWithLabel
              placeholder="Password"
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.password ? formik.errors.password : undefined
              }
            ></InputWithLabel>
          </div>
          <div className="flex justify-end p-1">
            <Link
              className="text-[#329A93] text-lg font-bold"
              to="/forgotpassword"
            >
              Forgot Password
            </Link>
          </div>

          <Button
            loading={loading}
            loadingText="Logging in..."
            disabled={!formik.isValid}
          >
            Login
          </Button>
        </form>

        <div className="p-[15px]">
          <p className="w-full flex justify-center text-black fon">
            I dont have an account &nbsp;
            <Link className="text-[#329A93] font-bold" to="/register">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
