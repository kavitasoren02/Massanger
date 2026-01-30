import { Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik, type FormikHelpers } from "formik";
import InputWithLabel from "../../components/component/InputWithLabel";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { FORGOT_PASSWORD } from "../../Service/useApiService";
import { toast } from "react-toastify";
import type {
  ForgotPasswordResponse,
  ForgotPasswordValues,
} from "../../Service/interface";
import { _post } from "../../Service/axios";
import { IoChevronBackCircle } from "react-icons/io5";

const ForgotPassword = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
  });

  const formik = useFormik<ForgotPasswordValues>({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (
      values: ForgotPasswordValues,
      actions: FormikHelpers<ForgotPasswordValues>,
    ) => {
      try {
        setLoading(true);
        const { data } = await _post<ForgotPasswordResponse>(FORGOT_PASSWORD, {
          email: values.email,
        });

        toast.success(data?.msg || "Reset Link sent successfully");
        // navigate("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
        actions.setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex justify-center items-center bg-[#EDEDED] px-4">
      <div className="w-full max-w-md p-6 md:p-8 bg-[#FFFFFF] rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-center text-[#329A93] mb-2">
          Forgot Password
        </h2>

        <p className="text-center font-semibold text-[#329A93] mb-7">
          You can recieve forgot password link
        </p>

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
            />
          </div>

          <Button
            loading={loading}
            loadingText="Sending ..."
            disabled={!formik.isValid}
          >
            {" "}
            Send Link
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

export default ForgotPassword;
