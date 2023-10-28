import createError from "http-errors";

// whitelist is an array of url's that are allowed to access the api
const whitelist = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5173",
  "https://kinsust.org",
  "https://www.kinsust.org",
  "https://kin-sust-nextjs-rejoyanislam.vercel.app",
  "http://127.0.0.1:5500",
];

// corsOptions is an object with a function that checks if the origin is in the whitelist
const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(createError(401, "Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

// export the corsOptions object
export default corsOptions;
