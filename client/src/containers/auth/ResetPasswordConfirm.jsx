import Layout from "../../hocs/Layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reset_password_confirm } from "../../redux/actions/auth";
import { Oval } from "react-loader-spinner";
import { Navigate } from "react-router-dom";
import { Link, useParams } from "react-router-dom";

export default function Reset_Password_Confirm() {
  const dispatch = useDispatch();
  const params = useParams();
  const loading = useSelector((state) => state.Auth.loading);
  const [requestSent, setRequestSent] = useState(false);
  const [formData, setFormData] = useState({
    new_password: "",
    re_new_password: "",
  });

  const { new_password, re_new_password } = formData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const { uid, token } = params;
    if (new_password === re_new_password) {
      dispatch(reset_password_confirm(uid, token, new_password, re_new_password));
      setRequestSent(true);
    }
  };

  if (requestSent && !loading) {
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            Set your new password
          </h2>
          <span className="text-gray-900">¿Recordaste tu contraseña? <Link className="text-blue-500" to="/login">Login here</Link> </span>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  value={new_password}
                  name="new_password"
                  type="password"
                  placeholder="Password"
                  required
                  onChange={onChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Repeat password
              </label>
              <div className="mt-2">
                <input
                  value={re_new_password}
                  name="re_new_password"
                  type="password"
                  placeholder="Repeat password"
                  required
                  onChange={onChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
              >
                {loading ? (
                  <Oval
                    height={20}
                    width={20}
                    color="#fff"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#fff"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                ) : (
                  "Reset password"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}