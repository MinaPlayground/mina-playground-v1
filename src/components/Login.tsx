import { FC } from "react";

const Login: FC = () => {
  return (
    <section className="bg-gray-50">
      <div className="flex justify-center m-4 sm:m-8">
        <div className="w-full lg:max-w-xl p-6 space-y-8 sm:p-8 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
          <form className="mt-8 space-y-6" action="#">
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                E-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="Your e-mail address"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  aria-describedby="remember"
                  name="remember"
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remember" className="font-medium text-gray-500">
                  Remember this device
                </label>
              </div>
              <a
                href="#"
                className="ml-auto text-sm font-medium text-blue-600 hover:underline"
              >
                Lost Password?
              </a>
            </div>
            <button
              type="submit"
              className="w-full px-5 py-3 text-base font-medium text-center text-white bg-gray-700 rounded-lg hover:bg-black focus:ring-4 focus:ring-blue-300 sm:w-auto"
            >
              Login to your account
            </button>
            <div className="text-sm font-medium text-gray-900">
              Not registered yet?{" "}
              <a className="text-blue-600 hover:underline" href="/">
                Create account
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
