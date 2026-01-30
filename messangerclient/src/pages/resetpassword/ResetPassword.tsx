import { useFormik, type FormikHelpers } from "formik";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import type { ResetPasswordValues } from "../../Service/interface";
import InputWithLabel from "../../components/component/InputWithLabel";
import Button from "../../components/ui/Button";
import { IoChevronBackCircle } from "react-icons/io5";
import { _get, _post } from "../../Service/axios";
import {
  PASSWORDCHANGE_ENDPOINTS,
  VALIDATETOKEN_ENDPOINTS,
} from "../../Service/useApiService";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { token } = useParams();
  const navigate = useNavigate();

  // console.log(token);

  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
      return;
    }

    const validateToken = async () => {
      try {
        await _get(`${VALIDATETOKEN_ENDPOINTS}/${token}`);
      } catch {
        toast.error("Reset link expired or invalid");
        navigate("/forgot-password");
      }
    };

    validateToken();
  }, [token, navigate]);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),

    retypePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik<ResetPasswordValues>({
    initialValues: {
      password: "",
      retypePassword: "",
    },
    validationSchema,
    onSubmit: async (
      values: ResetPasswordValues,
      actions: FormikHelpers<ResetPasswordValues>,
    ) => {
      try {
        if (!token) {
          toast.error("Invalid reset link");
          return;
        }
        setLoading(true);

        await _post(`${PASSWORDCHANGE_ENDPOINTS}/${token}`, {
          password: values.password,
        });
        toast.success("Password changed successfully");
        actions.resetForm();
        navigate("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Password reset failed");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#EDEDED] px-4">
      <div className="w-full max-w-md p-6 md:p-8 bg-[#FFFFFF] rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#329A93] mb-2">
          Forgot Password
        </h2>

        <form onSubmit={formik.handleSubmit}>
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
              placeholder="Re-Type Password"
              type="password"
              name="retypePassword"
              value={formik.values.retypePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.retypePassword
                  ? formik.errors.retypePassword
                  : undefined
              }
            ></InputWithLabel>
          </div>

          <Button
            loading={loading}
            loadingText="Saving..."
            disabled={!formik.isValid}
          >
            Save
          </Button>
        </form>

        <Link
          to="/login"
          className="flex items-center justify-center gap-1 text-[#329A93] mt-2 cursor-pointer"
        >
          <IoChevronBackCircle className="text-2xl" />
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
