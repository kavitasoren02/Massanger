import { useState, useMemo } from "react";
import * as Yup from "yup";
import { useFormik, type FormikHelpers } from "formik";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import type { SignUpFormValues, SignUpResponse } from "../../Service/interface";
import InputWithLabel from "../../components/component/InputWithLabel";
import { SIGNUP_ENDPOINT } from "../../Service/useApiService";
import { _post } from "../../Service/axios";
import Select from "../../components/ui/Select";
import countryData from "country-code-data";
import Button from "../../components/ui/Button";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const countryCurrencyPhone = useMemo(() => {
    return countryData.getAllCountries().map((item) => ({
      name: item.name,
      flag: item.flag,
      code: item.code,
    }));
  }, []);

  // console.log({ countryCurrencyPhone });

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(3, "First name must be atleast 3 characters")
      .max(50, "First name cannot exceed 50 characters")
      .required("First name is required"),

    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),

    mobileNumber: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be exactly 10 digits")
      .required("Mobile number is required"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik<SignUpFormValues>({
    initialValues: {
      fullName: "",
      email: "",
      countryCode: "+91",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (
      values: SignUpFormValues,
      actions: FormikHelpers<SignUpFormValues>,
    ) => {
      setLoading(true);
      try {
        const { confirmPassword, ...payload } = values;
        const { data } = await _post<SignUpResponse>(SIGNUP_ENDPOINT, payload);
        toast.success(data.msg);
        navigate("/login");
      } catch (error: any) {
        setLoading(false);
        toast.error(error.response?.data?.detail || "Something went wrong");
      } finally {
        setLoading(false);
        actions.setSubmitting(false);
      }
    },
  });
  return (
    <div className="min-h-screen flex justify-center items-center bg-[#EDEDED] px-4">
      <div className="w-full max-w-md p-6 md:p-8 bg-[#FFFFFF] rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#329A93] mb-6">
          Register
        </h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex">
            <InputWithLabel
              placeholder="Full Name"
              type="text"
              name="fullName"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.fullName ? formik.errors.fullName : undefined
              }
            ></InputWithLabel>
          </div>

          <div className="flex gap-1">
            <div className="w-45">
              <Select
                name="countryCode"
                value={formik.values.countryCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                options={countryCurrencyPhone}
                error={
                  formik.touched.countryCode
                    ? formik.errors.countryCode
                    : undefined
                }
              />
            </div>

            <div className="flex-1">
              <InputWithLabel
                placeholder="Mobile Number"
                type="text"
                name="mobileNumber"
                value={formik.values.mobileNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.mobileNumber
                    ? formik.errors.mobileNumber
                    : undefined
                }
              />
            </div>
          </div>

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

          <div className="flex">
            <InputWithLabel
              placeholder="Re Enter Password"
              type="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword
                  ? formik.errors.confirmPassword
                  : undefined
              }
            ></InputWithLabel>
          </div>
          <Button loading={loading} loadingText="Registering...">
            Register{" "}
          </Button>
        </form>
        <div className="p-[15px]">
          <p className="w-full flex justify-center text-black fon">
            I have already an account &nbsp;
            <Link className="text-[#329A93] font-bold" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
